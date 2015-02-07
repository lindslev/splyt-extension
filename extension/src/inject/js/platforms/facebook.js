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
          $.ajax({ url : 'https://api.soundcloud.com/resolve.json?url=' + href + '&client_id=7af759eb774be5664395ed9afbd09c46' })
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
