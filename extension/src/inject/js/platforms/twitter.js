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
