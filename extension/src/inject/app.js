//modules.on('Endpoint',function(response){
//response.err and response.data
//})

//modules.send({
// action:"Endpoint"
// method:"GET"
// args: {_id:'123456'}
//})

modules.on('init', init)

function init() {
  console.log('app initialized')
  //PUT YOUR APP LOGIC HERE, be it injecting an mvc framework, jquery logic, whatever.

  // For example:

  //var playlist = [];

  // modules.on('Playlist:ADD',function(response){
  //    playlist.push(response.data)
  //    update app state.......
  // })

  // $('.soundcloud_embed').on('click',function(){
  //    var trackId = $(this).attr('track-id');
  //    modules.send({
  //      action: 'Playlist:ADD',
  //      method:,'POST'
  //      args: {
  //        item_id : trackId
  //      }
  //    })
  //})
}

modules.on('checkForEmbed', scrapeEmbed)

var songsOnPage = [];
function scrapeEmbed() {
  var playlistButton = "<button class='playlistButton'>Add to Splyt</button>";
  var tempDiv = document.createElement('div');
  tempDiv.innerHTML = playlistButton;

  var iframes = document.getElementsByTagName('iframe');
  for(var key in iframes) {
    var iframe = iframes[key];
    if(iframe.outerHTML) {
        if(iframe.outerHTML.match(/soundcloud/g)) {
          var src = decodeURIComponent(iframe.src)
          if(src.split('tracks/').length == 2) {
            var scTrackId = src.split('tracks/')[1].split(/[\?\&]/)[0];
            var url = "https://api.soundcloud.com/tracks/" + scTrackId + "?client_id=7af759eb774be5664395ed9afbd09c46&format=json";
            $.ajax({url: url})
              .done(function(song){
                  chrome.runtime.sendMessage({
                    action: 'newSong',
                    method: '',
                    args: { song: song }
                  })
              });
          }
          // modules.send({
          //    action: 'soundcloud_get',
          //    method:'GET'
          //    args: {
          //      trackId : scTrackId,
          //      url : url
          //    }
          // })
        }
    }
  }
}

function currentSongs() {
  return songsOnPage;
}
