function scrapeEmbed() {

  var domain = document.domain.replace(/\./g, '+') + window.location.pathname.replace(/\//g, '+');

  var iframes = document.getElementsByTagName('iframe');
  var youtubeIDs = ""; //tracks which ids we've sent to the background script already
  var spotifyUsers = ""; //tracks which user playlists we've sent already

  Object.keys(iframes).forEach(function(key){
  // for(var key in iframes) {
    var iframe = iframes[key];
    if(iframe.outerHTML) {
        /** soundcloud embeds **/
        if(iframe.outerHTML.match(/soundcloud/g)) {
          var src = decodeURIComponent(iframe.src)
          /** soundcloud track embeds **/
          if(src.split('tracks/').length == 2) {
            var scTrackId = src.split('tracks/')[1].split(/[\?\&]/)[0];
            var url = "https://api.soundcloud.com/tracks/" + scTrackId + "?client_id=7af759eb774be5664395ed9afbd09c46&format=json";
            callSoundcloudTrackAPI(url, src);
          }
          /** soundcloud playlist embeds **/
          //leaving this out until the web app is ready to accomodate playlists
          // if(src.split('playlists/').length == 2) {
          //   var scPlaylistId = src.split('playlists/')[1].split(/[\?\&]/)[0];
          //   var url = "https://api.soundcloud.com/playlists/" + scPlaylistId + "?client_id=7af759eb774be5664395ed9afbd09c46&format=json";
          //   callSoundcloudPlaylistAPI(url, src);
          // }
        } /** end soundcloud embeds **/
        if(iframe.outerHTML.match(/youtube/g) && !domain.match(/youtube/g)) {
          var src = decodeURIComponent(iframe.src)
          var videoID = src.split('/embed/')[1].split('?')[0];
          if(youtubeIDs.indexOf(videoID) < 0) { //tests to see if we've checked this iframe yet
            youtubeIDs += videoID;
            callYoutubeAPI(videoID, src);
          }
        } /** end general youtube embeds **/
        /** for tumblr dashboard embedded youtubes**/
        if(iframe.outerHTML.match(/safe.txmblr/g) && iframe.outerHTML.match(/style="width/g)) {
          $.ajax({ url: iframe.src })
            .done(function(result){
              var iframe = result.substring(result.indexOf('<iframe'), (result.indexOf('</iframe>') + 9));
              if(iframe.match(/youtube/g)) {
                var src = iframe.substring(iframe.indexOf('src="'), iframe.indexOf('" frameborder'));
                src = decodeURIComponent(src);
                var videoID = src.split('/embed/')[1].split('?')[0];
                if(youtubeIDs.indexOf(videoID) < 0) { //tests to see if we've checked this iframe yet
                  youtubeIDs += videoID;
                  callYoutubeAPI(videoID, src);
                }
              }
            })
        }
        /** end youtube embeds **/
        if(iframe.outerHTML.match(/spotify/g)) {
          var src2 = decodeURIComponent(iframe.src);
          if(src2.split(':track:').length > 1) {
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
          } /** end spotify track embeds **/
          //leaving out until web app ready to accomodate playlists
          // if(src2.split(':playlist:').length > 1) {
          //   var spotPLId = src2.split(':playlist:')[1].split('&')[0];
          //   var spotPLUserId = src2.split(':playlist:')[0].split(':user:')[1];
          //   if(spotifyUsers.indexOf(spotPLUserId) < 0) {
          //     spotifyUsers += spotPLUserId;
          //     var permalink_url = "http://open.spotify.com/user/" + spotPLUserId + "/playlist/" + spotPLId;
          //     var playlist = { permalink_url: permalink_url, user: spotPLUserId }
          //     chrome.runtime.sendMessage({
          //         action: 'newSpotifyPlaylist',
          //         method: '',
          //         args: { playlist: playlist, iframeSrc: src2 }
          //       })
          //   }
          // }
          /** end spotify playlist embeds **/
        } /**end spotify embeds **/

    } /** end if(iframe.outerHTML)**/
  }) /** end key in iframes **/
} /** end scrapeEmbed() **/
