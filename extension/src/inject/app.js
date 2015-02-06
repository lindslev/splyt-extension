modules.on('init', init)

function init() {
  console.log('app initialized')
}
///////////////////////////////////////////
//            HELPER FUNCTIONS           //
///////////////////////////////////////////
function isValidEntertainment(id, title, desc) { //checks youtube ent category and corresponding keywords
  return ['5', '8', '18', '24'].indexOf(id) >= 0 &&
  (desc.match(/lyrics/g) || desc.match(/music/g) || title.match(/audio/g) || title.match(/lyrics/g) || title.match(/remix/g));
}

function isMusic(id) { //checks youtube music category
  return id == '10';
}

function domainName() {
  return document.domain.replace(/\./g, '+') + window.location.pathname.replace(/\//g, '+');
}

function unsafe(e) { //unsafe fxn stolen from reddit lulz
  return typeof e == "string" && (e = e.replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&")), e || ""
}

function callYoutubeAPI(videoID, src) {
  $.ajax({
      url: 'http://192.168.1.121:9000/api/youtubes/' + videoID,
      type: 'GET'
  })
  .done(function(result){
    result = JSON.parse(result);
    if(result.items[0]) {
      var catId = result.items[0].snippet.categoryId,
          desc = result.items[0].snippet.description,
          title = result.items[0].snippet.title;
      if(isMusic(catId) || isValidEntertainment(catId, title, desc)) { //if music category or entertainment song
        chrome.runtime.sendMessage({
          action: 'newYoutubeSong',
          method: 'general',
          args: { info : result, iframeSrc: src }
        })
      }
    }
  })
}

function callSoundcloudTrackAPI(url, src) {
  $.ajax({url: url})
    .done(function(song){
        chrome.runtime.sendMessage({
          action: 'newSCSong',
          method: '',
          args: { song : song, iframeSrc: src }
        })
    });
}

function callSoundcloudPlaylistAPI(url, src) {
  $.ajax({url: url})
    .done(function(playlist){
        chrome.runtime.sendMessage({
          action: 'newSCPlaylist',
          method: '',
          args: { playlist: playlist, iframeSrc: src }
        })
    });
}

function registerScrollEvents(scrapeFn) {
  var debounceScrape = _.debounce(scrapeFn, 500);
  var $window = $(window);
  $window.on('scroll', debounceScrape);
  modules.on('checkForEmbed', function() {
    $window.off('scroll', debounceScrape);
  })
  $window.scroll();
}
////////////// END HELPERS ////////////


////
/***
  ** start general embeds **
***/
////

modules.on('checkForEmbed', scrapeEmbed)

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
          if(src.split('playlists/').length == 2) {
            var scPlaylistId = src.split('playlists/')[1].split(/[\?\&]/)[0];
            var url = "https://api.soundcloud.com/playlists/" + scPlaylistId + "?client_id=7af759eb774be5664395ed9afbd09c46&format=json";
            callSoundcloudPlaylistAPI(url, src);
          }
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
          if(src2.split(':playlist:').length > 1) {
            var spotPLId = src2.split(':playlist:')[1].split('&')[0];
            var spotPLUserId = src2.split(':playlist:')[0].split(':user:')[1];
            if(spotifyUsers.indexOf(spotPLUserId) < 0) {
              spotifyUsers += spotPLUserId;
              var permalink_url = "http://open.spotify.com/user/" + spotPLUserId + "/playlist/" + spotPLId;
              var playlist = { permalink_url: permalink_url, user: spotPLUserId }
              chrome.runtime.sendMessage({
                  action: 'newSpotifyPlaylist',
                  method: '',
                  args: { playlist: playlist, iframeSrc: src2 }
                })
            }
          } /** end spotify playlist embeds **/
        } /**end spotify embeds **/

    } /** end if(iframe.outerHTML)**/
  }) /** end key in iframes **/
} /** end scrapeEmbed() **/


////
/***
  ** start Tumblr **
***/
////

modules.on('tumblrAudio', _.debounce(scrapeTumblr, 200))

function scrapeTumblr() {
  var holder = []; //tracks songs we've sent already
  function scrape() {
    var songs = document.getElementsByClassName('tumblr_audio_player'); //diff format depending on whether youre looking at someone's blog
    var dashSongs = document.getElementsByClassName('audio_player_container'); //or actually in the tumblr dash
    if(songs.length !== 0) {
      Object.keys(songs).forEach(function(key){
      // for(var key in songs){
        if(typeof songs[key] == 'object') {
          var song = songs[key];
          var src = decodeURIComponent(song.src);
          if(holder.indexOf(src) < 0) {
            holder.push(src);
            $.ajax({ url: song.src }).done(function(result){
              var songTitle = result.substring(result.indexOf('data-track="') + 12, result.indexOf('data-artist=') - 6);
              var songArtist = result.substring(result.indexOf('data-artist="') + 13, result.indexOf('data-album=') - 6);
              var songAlbum = result.substring(result.indexOf('data-album="') + 12, result.indexOf('data-service=') - 6);
              var song = { title: songTitle, artist: songArtist, album: songAlbum };
              chrome.runtime.sendMessage({
                action: 'newTumblrSong',
                method: 'tumblog',
                args: { song: song, iframeSrc: src }
              })
            })
          }
        }
      })
    }
    if(dashSongs.length !== 0) {
      Object.keys(dashSongs).forEach(function(key){
      // for(var key in dashSongs){
        if(typeof dashSongs[key] == 'object') {
          var song = dashSongs[key];
          var songTitle = song.attributes['data-track'].value;
          var songArtist = song.attributes['data-artist'].value;
          var songAlbum = song.attributes['data-album'].value;
          var permalink_url = song.attributes['data-stream-url'].value.substring(
                              song.attributes['data-stream-url'].value.indexOf('/audio_file/') + 12,
                              song.attributes['data-stream-url'].value.indexOf('/tumblr_')
                            )
          permalink_url = "http://" + permalink_url.split('/')[0] + ".tumblr.com/post/" + permalink_url.split('/')[1];
          var songInfo = { title: songTitle, artist: songArtist, album: songAlbum, permalink_url: permalink_url };
          if(holder.indexOf(permalink_url) < 0) {
            holder.push(permalink_url);
            $.ajax({ url: permalink_url }).done(function(result){
              var iframe = result.substring(result.indexOf('<iframe class="tumblr_audio_player'), result.indexOf('</iframe>') + 9);
              var iframeSrc = iframe.substring(iframe.indexOf('src="') + 5, iframe.indexOf('" frameborder='));
              chrome.runtime.sendMessage({
                action: 'newTumblrSong',
                method: 'dashboard',
                args: { song: songInfo, iframeSrc: iframeSrc }
              })
            })
          }
        }
      }) /**/
    }
  }
  registerScrollEvents(scrape);
}

////
/***
  ** start Reddit **
***/
////

modules.on('redditAudio', scrapeReddit)

function scrapeReddit() {
  var things = $('.thing').not('.reddit-link', '.promotedlink');
  things.each(function(){
    var $this = $(this);
    var script = $this.find('script');
    var title = $this.find('.title.may-blank.loggedin').text();
    var href = $this.find('.title.may-blank.loggedin').attr('href');
    var iframe = unsafe(script.text().substring(script.text().indexOf('cache"] = ') + 12, script.text().length - 2));
    var src = iframe.substring(iframe.indexOf('src="') + 5, iframe.indexOf('" id="'));
    if(src) {
      var song = { title: title, permalink_url: href }
      if(href.match(/youtube/g)) {
        if(href.indexOf('&') >= 0) {
          var videoID = href.substring(href.indexOf('?v=') + 3, href.indexOf('&'))
        } else {
          var videoID = href.substring(href.indexOf('?v=') + 3, href.length);
        }
        callYoutubeAPI(videoID, src);
      }
      if(href.match(/soundcloud/g)) {
        chrome.runtime.sendMessage({
          action: 'newSCSong',
          method: '',
          args: { song : song, iframeSrc: src }
        })
      }
    }
  })
}

////
/***
  ** start Facebook **
***/
////

modules.on('facebookAudio', _.debounce(scrapeFacebook, 2000))

function scrapeFacebook() {
  var holder = []; //dont resend msg if we already did for this song
  function scrape() {
    var embeds = $('.lfloat > span > div > div > a');
    embeds.each(function(){
      var href = decodeURIComponent($(this).attr('href'));
      var outerHTML = this.outerHTML;
      if(outerHTML.match(/soundcloud/g)) {
        songTitle = $(this).text();
        if(href.split('php?u=').length > 1) href = href.split('php?u=')[1].split('&')[0];
        console.log('inside embed SC', songTitle, holder)
        if(holder.indexOf(songTitle) < 0) {
          holder.push(songTitle);
          $.ajax({ url : 'http://api.soundcloud.com/resolve.json?url=' + href + '&client_id=7af759eb774be5664395ed9afbd09c46' })
            .done(function(result){
                chrome.runtime.sendMessage({
                  action: 'newSCSong',
                  method: '',
                  args: { song : result, iframeSrc: null }
                })
            })
        }
      }
      if(outerHTML.match(/youtube/g)) {
        songTitle = outerHTML.split('aria-label="')[1].split('" ajaxify=')[0];
        videoID = href.split('watch?v=')[1].split('&')[0];
        if(holder.indexOf(videoID) < 0) {
          holder.push(videoID);
          callYoutubeAPI(videoID, null);
        }
      }
    })
  }
  registerScrollEvents(scrape);
}

////
/***
  ** start YouTube **
***/
////

modules.on('youtubeNative', _.debounce(scrapeYoutube, 200))

function scrapeYoutube() {
  var holder = [];
  function scrape() {
    //home page and search page
    var vids = $('.yt-lockup-title');
    vids.each(function(){
      var outerHTML = this.outerHTML;
      console.log('whyyyy', outerHTML);
      if(outerHTML.split('watch?v=').length > 1) {
        var videoID = outerHTML.split('watch?v=')[1].split('"')[0];
        var title = outerHTML.split('title="')[1].split('"')[0];
        if(holder.indexOf(videoID) < 0) {
          holder.push(videoID)
          callYoutubeAPI(videoID, null);
        }
      }
    })

    //watching a single vid
    var video = $('#watch7-content');
    video.each(function(){
      var videoID = this.innerHTML.split('itemprop="videoId" content="')[1].split('">')[0];
      if(holder.indexOf(videoID) < 0) {
        holder.push(videoID)
        callYoutubeAPI(videoID, null);
      }
    })

    //recommended vids on a song page
    var thumbVids = $('.thumb-link');
    thumbVids.each(function(){
      var videoID = $(this).attr('href').split("?v=")[1];
      if(holder.indexOf(videoID) < 0) {
        holder.push(videoID)
        callYoutubeAPI(videoID, null);
      }
    })
  }
  registerScrollEvents(scrape);
}

////
/***
  ** start Soundcloud **
***/
////
if(domainName().match(/soundcloud/g)) {
  chrome.runtime.sendMessage({
    action: 'soundcloudLoading',
    method: '',
    args : {}
  })
}

modules.on('soundcloudNative', _.debounce(scrapeSoundcloud, 200))

function scrapeSoundcloud() {
  var holder = [];
  function scrape() {
    // search/explore/stream pages: document.getElementsByClassName('streamContext')
    var searchTracks = $('.sound__coverArt');
    searchTracks.each(function(){
      var href = "http://soundcloud.com" + $(this).attr('href');
      if(holder.indexOf(href) < 0) {
        holder.push(href);
        $.ajax({ url : 'https://api.soundcloud.com/resolve.json?url=' + href + '&client_id=7af759eb774be5664395ed9afbd09c46' })
                .done(function(result){
                    chrome.runtime.sendMessage({
                      action: 'newSCSong',
                      method: '',
                      args: { song : result, iframeSrc: null }
                    })
                })
      }
    })
    // main song on song page: query domain
    if(searchTracks.length == 0) {
      var domain = "http://" + document.domain + window.location.pathname;
      console.log('domain', domain)
      if(holder.indexOf(domain) < 0) {
        holder.push(domain);
        $.ajax({ url : 'https://api.soundcloud.com/resolve.json?url=' + domain + '&client_id=7af759eb774be5664395ed9afbd09c46' })
                .done(function(result){
                    chrome.runtime.sendMessage({
                      action: 'newSCSong',
                      method: '',
                      args: { song : result, iframeSrc: null }
                    })
                })
      }
      // recommended tracks on song page: document.getElementsByClassName('soundBadge__avatarLink')
      var recTracks = $('.soundBadge__avatarLink');
      recTracks.each(function(){
        var href = "http://soundcloud.com" + $(this).attr('href');
        if(holder.indexOf(href) < 0) {
          holder.push(href);
          $.ajax({ url : 'https://api.soundcloud.com/resolve.json?url=' + href + '&client_id=7af759eb774be5664395ed9afbd09c46' })
                .done(function(result){
                    chrome.runtime.sendMessage({
                      action: 'newSCSong',
                      method: '',
                      args: { song : result, iframeSrc: null }
                    })
                })
        }
      })
    }
  }
  registerScrollEvents(scrape);
}

////
/***
  ** start Twitter **
***/
////

modules.on('twitterAudio', _.debounce(scrapeTwitter, 2000))

function scrapeTwitter() {
  var holder = []; //dont resend msg if we already did for this song
  function scrape() {
    var media = $('.media-preview');
    media.each(function(){
      var url = decodeURIComponent(this.outerHTML.split('data-source-url="')[1].split('"')[0]);
      if(url.match(/soundcloud/g)) {
        if(holder.indexOf(url) < 0) {
          holder.push(url);
          /** soundcloud track embeds **/
          if(url.split('tracks/').length == 2) {
            var scTrackId = url.split('tracks/')[1].split(/[\?\&]/)[0];
            var url = "https://api.soundcloud.com/tracks/" + scTrackId + "?client_id=7af759eb774be5664395ed9afbd09c46&format=json";
            callSoundcloudTrackAPI(url, null)
          }
          /** soundcloud playlist embeds **/
          if(url.split('playlists/').length == 2) {
            var scPlaylistId = url.split('playlists/')[1].split(/[\?\&]/)[0];
            var url = "https://api.soundcloud.com/playlists/" + scPlaylistId + "?client_id=7af759eb774be5664395ed9afbd09c46&format=json";
            callSoundcloudPlaylistAPI(url, null);
          }
        }
      }
      if(url.match(/youtube/g)) {
        if(holder.indexOf(url) < 0) {
          holder.push(url);
          var videoID = url.split('/embed/')[1];
          callYoutubeAPI(videoID, null);
        }
      }
    })
  }
  registerScrollEvents(scrape);
}
