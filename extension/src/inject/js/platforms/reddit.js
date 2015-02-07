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