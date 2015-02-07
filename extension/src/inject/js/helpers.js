function domainName() {
  return document.domain.replace(/\./g, '+') + window.location.pathname.replace(/\//g, '+');
}

function unsafe(e) { //unsafe fxn stolen from reddit lulz
  return typeof e == "string" && (e = e.replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&")), e || ""
}

function isValidEntertainment(id, title, desc) { //checks youtube ent category and corresponding keywords
  return ['5', '8', '18', '24'].indexOf(id) >= 0 &&
  (desc.match(/lyrics/g) || desc.match(/music/g) || title.match(/audio/g) || title.match(/lyrics/g) || title.match(/remix/g));
}

function isMusic(id) { //checks youtube music category
  return id == '10';
}

function callYoutubeAPI(videoID, src) {
  $.ajax({
      url: 'http://192.168.1.148:9000/api/youtubes/' + videoID,
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
