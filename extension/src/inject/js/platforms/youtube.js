function scrapeYoutube() {
  var holder = [];
  function scrape() {
    //home page and search page
    var vids = $('.yt-lockup-title');
    vids.each(function(){
      var outerHTML = this.outerHTML;
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
