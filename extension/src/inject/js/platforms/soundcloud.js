function scrapeSoundcloud() {
  var holder = [];
  function scrape() {
    // search/explore/stream pages: document.getElementsByClassName('streamContext')
    var searchTracks = $('.sound__coverArt');
    searchTracks.each(function(){
      var href = "http://soundcloud.com" + $(this).attr('href');
      if(holder.indexOf(href) < 0 && !href.match(/sets/g)) {
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
      if(holder.indexOf(domain) < 0 && !domain.match(/sets/g)) {
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
        if(holder.indexOf(href) < 0 && !href.match(/sets/g)) {
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
