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
          var user = src.split('http://')[1].split('.tumblr')[0];
          var postId = src.split('/post/')[1].split('/audio_player_iframe')[0];
          if(src.split('tumblr_')[1].split('?audio_file')[0].length > 1) { // BUGGY
            var tumblrSecret = src.split('tumblr_')[1].split('?audio_file')[0];
          } else {
            var tumblrSecret = src.split('tumblr_')[1].split('&')[0];
          }
          var permalink_url = "http://" + user + ".tumblr.com/post/" + postId;
          var audioSrc = 'https://www.tumblr.com/audio_file/' + user + '/' + postId + '/tumblr_' + tumblrSecret + '?play_key=e6ba8f023e92bbb5aaf06052cd0c6551&tumblelog=' + user + '&post_id=' + postId;
          if(holder.indexOf(src) < 0) {
            holder.push(src);
            $.ajax({ url: song.src }).done(function(result){
              var songTitle = result.substring(result.indexOf('data-track="') + 12, result.indexOf('data-artist=') - 6);
              var songArtist = result.substring(result.indexOf('data-artist="') + 13, result.indexOf('data-album=') - 6);
              var songAlbum = result.substring(result.indexOf('data-album="') + 12, result.indexOf('data-service=') - 6);
              var song = { title: songTitle, artist: songArtist, album: songAlbum, permalink_url: permalink_url };
            console.log('permalink_url', song, permalink_url)
              chrome.runtime.sendMessage({
                action: 'newTumblrSong',
                method: 'tumblog',
                args: { song: song, iframeSrc: audioSrc }
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
          var tumblrSecret = $('.album_art_container > img').attr('src').split('tumblr_')[1].split('o1')[0];
          var songTitle = song.attributes['data-track'].value;
          var songArtist = song.attributes['data-artist'].value;
          var songAlbum = song.attributes['data-album'].value;
          var permalink_url = song.attributes['data-stream-url'].value.substring(
                              song.attributes['data-stream-url'].value.indexOf('/audio_file/') + 12,
                              song.attributes['data-stream-url'].value.indexOf('/tumblr_')
                            )
          var user = permalink_url.split('/')[0];
          var postId = permalink_url.split('/')[1];
          permalink_url = "http://" + user + ".tumblr.com/post/" + postId;
          var audioSrc = 'https://www.tumblr.com/audio_file/' + user + '/' + postId + '/tumblr_' + tumblrSecret + '?play_key=e6ba8f023e92bbb5aaf06052cd0c6551&tumblelog=' + user + '&post_id=' + postId;
          var songInfo = { title: songTitle, artist: songArtist, album: songAlbum, permalink_url: permalink_url };
          if(holder.indexOf(permalink_url) < 0) {
            holder.push(permalink_url);
            // $.ajax({ url: permalink_url }).done(function(result){
              // var iframe = result.substring(result.indexOf('<iframe class="tumblr_audio_player'), result.indexOf('</iframe>') + 9);
              // var iframeSrc = iframe.substring(iframe.indexOf('src="') + 5, iframe.indexOf('" frameborder='));
              chrome.runtime.sendMessage({
                action: 'newTumblrSong',
                method: 'dashboard',
                args: { song: songInfo, iframeSrc: audioSrc }
              })
            // })
          }
        }
      }) /**/
    }
  }
  registerScrollEvents(scrape);
}
