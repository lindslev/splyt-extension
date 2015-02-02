var ytAPI = "AIzaSyC_eZm_iimb5fx5So3Bt4h96ZuKQqd7ARU";
//modules.on('Endpoint',function(response){
//response.err and response.data
//})

//modules.send({
// action:"Endpoint"
// method:"GET"
// args: {_id:'123456'}
//})

// $(".play-ctrl:first").trigger("click")
// [5:17 PM] LuckySpammer:
// '/serve/source/' + window.playList['tracks'][track].id + '/' + window.playList['tracks'][track].key

// that will give you a URL you can make an AJAX call to.

// Which will respond with the URL to track.

modules.on('init', init)

function init() {
  console.log('app initialized')
}

modules.on('checkForEmbed', scrapeEmbed)

function scrapeEmbed() {
  var iframes = document.getElementsByTagName('iframe');
  var youtubeIDs = ""; //tracks which ids we've sent to the background script already

  for(var key in iframes) {
    var iframe = iframes[key];
    if(iframe.outerHTML) {
        /** soundcloud embeds **/
        if(iframe.outerHTML.match(/soundcloud/g)) {
          var src = decodeURIComponent(iframe.src)
          /** soundcloud track embeds **/
          if(src.split('tracks/').length == 2) {
            var scTrackId = src.split('tracks/')[1].split(/[\?\&]/)[0];
            var url = "https://api.soundcloud.com/tracks/" + scTrackId + "?client_id=7af759eb774be5664395ed9afbd09c46&format=json";
            $.ajax({url: url})
              .done(function(song){
                  chrome.runtime.sendMessage({
                    action: 'newSCSong',
                    method: '',
                    args: { song : song, iframeSrc: src }
                  })
              });
          }
          /** soundcloud playlist embeds **/
          if(src.split('playlists/').length == 2) {
            var scPlaylistId = src.split('playlists/')[1].split(/[\?\&]/)[0];
            var url = "https://api.soundcloud.com/playlists/" + scPlaylistId + "?client_id=7af759eb774be5664395ed9afbd09c46&format=json";
            $.ajax({url: url})
              .done(function(playlist){
                  chrome.runtime.sendMessage({
                    action: 'newSCPlaylist',
                    method: '',
                    args: { playlist: playlist, iframeSrc: src }
                  })
              });
          }
        } /** end soundcloud embeds **/
        if(iframe.outerHTML.match(/youtube/g)) {
          var src = decodeURIComponent(iframe.src)
          var videoID = src.split('/embed/')[1].split('?')[0];
          if(youtubeIDs.indexOf(videoID) < 0) { //tests to see if we've checked this iframe yet
            youtubeIDs += videoID;
            $.ajax({
                      url: '192.168.1.121:9000/api/youtubes/' + videoID,
                      type: 'GET'
                  })
                  .done(function(result){
                    result = JSON.parse(result);
                    if(result.items[0].snippet.categoryId == '10') { //if music category
                      chrome.runtime.sendMessage({
                        action: 'newYoutubeSong',
                        method: '',
                        args: { info : result, iframeSrc: src }
                      })
                    }
                  })
          }
        }
        /** for tumblr dashboard embedded youtubes**/
        if(iframe.outerHTML.match(/safe.txmblr/g) && iframe.outerHTML.match(/style="width/g)) {
          $.ajax({ url: iframe.src })
            .done(function(result){
              var iframe = result.substring(result.indexOf('<iframe'), (result.indexOf('</iframe>') + 9));
              if(iframe.match(/youtube/g)) {
                console.log('iframes matching safetxmblr', iframe)
                var src = iframe.substring(iframe.indexOf('src="'), iframe.indexOf('" frameborder'));
                src = decodeURIComponent(src);
                var videoID = src.split('/embed/')[1].split('?')[0];
                if(youtubeIDs.indexOf(videoID) < 0) { //tests to see if we've checked this iframe yet
                  youtubeIDs += videoID;
                  $.ajax({
                            url: '192.168.1.121:9000/api/youtubes/' + videoID,
                            type: 'GET'
                        })
                        .done(function(result){
                          result = JSON.parse(result);
                          if(result.items[0].snippet.categoryId == '10') { //if music category
                            chrome.runtime.sendMessage({
                              action: 'newYoutubeSong',
                              method: '',
                              args: { info : result, iframeSrc: src }
                            })
                          }
                        })
                }
              }
            })
        }
        /** end youtube embeds **/
        if(iframe.outerHTML.match(/spotify/g)) {
          var src2 = decodeURIComponent(iframe.src);
          var spotTrackId = src2.split(':track:')[1].split('&')[0];
          $.ajax({
              url: 'https://api.spotify.com/v1/tracks/' + spotTrackId,
              type: 'GET'
            })
            .done(function(track){
              chrome.runtime.sendMessage({
                action: 'newSpotifySong',
                method: '',
                args: { info: track, iframeSrc: src2 }
              })
            })
        } /**end spotify embeds **/

    } /** end if(iframe.outerHTML)**/
  } /** end key in iframes **/
} /** end scrapeEmbed() **/
