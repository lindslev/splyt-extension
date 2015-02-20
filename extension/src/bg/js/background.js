//PUT YOUR IP ADDRESS HERE with http:// in front of it. It's important, at least for DEV environments.
//When you're in production, make sure that your production url's reflected here.
var Splyt = new Splyt('192.168.1.148:9000');
chrome.browserAction.setBadgeBackgroundColor({ color: '#009688' })

function setBrowserBadgeToZero() {
  chrome.browserAction.setBadgeText({ text : '0' });
}
setBrowserBadgeToZero();

// Splyt is essentially a resource at this point and you can run methods on it like:
// Splyt.Endpoint().GET(arguments,callback);

// Chrome runtime expects to be sent an object ('message' in the example below) with keys:
// action - the endpoint you want to target, like comment, item, user, etc
// method - get,post,update, or delete.
// args - an object containing the data you need to send in request body or params.

var currentSongsOnPage = [], currentPlaylistsOnPage = [], currentSpotPlaylistsOnPage = [];
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log('RECEIVED MESSAGE FROM CONTENT:', message)
    var obj = { action: message.action, args: message.args }
    if(message.action == 'newSCSong') currentSongsOnPage.push(obj);
    if(message.action == 'newSCPlaylist') currentPlaylistsOnPage.push(obj);
    if(message.action == 'newYoutubeSong') {
      if(message.method == 'general') { //general embeds, dont need to do this for reddit embeds
        obj.args.song = {
            permalink_url: "https://www.youtube.com/watch?v=" + message.args.info.items[0].id,
            title: message.args.info.items[0].snippet.title
        }
      }
      currentSongsOnPage.push(obj)
    }
    if(message.action == 'newSpotifySong') {
      obj.args.song = {
        permalink_url: message.args.info.external_urls.spotify,
        title: message.args.info.name
      }
      currentSongsOnPage.push(obj);
    }
    if(message.action == 'newSpotifyPlaylist') {
      currentSpotPlaylistsOnPage.push(obj);
    }
    if(message.action == 'newTumblrSong') {
      currentSongsOnPage.push(obj);
    }
    if(message.action == 'soundcloudLoading') { //get tabs for domain fxn
      chrome.tabs.query({}, function(tabs){
        tabs.forEach(function(tab){
          if(tab.url.match(/soundcloud/g)) {
            chrome.tabs.sendMessage(tab.id, {
              action: 'soundcloudNative',
              err: null,
              data: null
            }, function(response){
              if(response) console.log(response);
            })
          }
        })
      })
    }
    chrome.browserAction.setBadgeText({ text : currentSongsOnPage.length.toString() });
})

////////////////////////////////////////////////////////////////////////
// Whenever you open a new tab or go to a new page from an existing tab, and it finishes loading, send a message to that tab telling the app to initialize.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  setBrowserBadgeToZero();
  if(!tab.url.match(/localhost/g)) {
    if (changeInfo.status && changeInfo.status == 'complete') {
      runChecks(tabId)
    }
    runSpecialChecks(tab, tabId)
  }
})

/////////////////////////////////////////////
// Fires when the active tab in a window changes
chrome.tabs.onActivated.addListener(function(changeInfo){
  setBrowserBadgeToZero();
    runChecks(changeInfo.tabId)
    chrome.tabs.query({}, function(tabs){
      tabs.forEach(function(tab){
        if(tab.id == changeInfo.tabId) {
          if(!tab.url.match(/localhost/g)) {
            runSpecialChecks(tab, changeInfo.tabId)
          }
        }
      })
    })
})

///////////////////////////////////////////
// Run general embed checks on tab change && page load
function runChecks(tabId) {
  currentSongsOnPage = [];
  currentPlaylistsOnPage = [];
  currentSpotPlaylistsOnPage = [];
  chrome.tabs.sendMessage(tabId, {
            action: 'checkForEmbed',
            err: null,
            data: null
        }, function(response) {
            if (response) console.log(response);
        });
}
///////////////////////////////////////////
// Run special cases checks on tab change && page load
function runSpecialChecks(tab, tabId) {
  if(tab.url.match(/tumblr/g)) {
    chrome.tabs.sendMessage(tabId, {
      action: 'tumblrAudio',
      err: null,
      data: null
    }, function(response){
      if(response) console.log(response);
    })
  }
  if(tab.url.match(/reddit/g)) {
    chrome.tabs.sendMessage(tabId, {
      action: 'redditAudio',
      err: null,
      data: null
    }, function(response){
      if(response) console.log(response);
    })
  }
  if(tab.url.match(/facebook/g)) {
    chrome.tabs.sendMessage(tabId, {
      action: 'facebookAudio',
      err: null,
      data: null
    }, function(response){
      if(response) console.log(response);
    })
  }
  if(tab.url.match(/youtube/g)) {
    chrome.tabs.sendMessage(tabId, {
      action: 'youtubeNative',
      err: null,
      data: null
    }, function(response){
      if(response) console.log(response);
    })
  }
  if(tab.url.match(/soundcloud/g)) {
    console.log('test...')
    chrome.tabs.sendMessage(tabId, {
      action: 'soundcloudNative',
      err: null,
      data: null
    }, function(response){
      if(response) console.log(response);
    })
  }
  if(tab.url.match(/twitter/g)) {
    chrome.tabs.sendMessage(tabId, {
      action: 'twitterAudio',
      err: null,
      data: null
    }, function(response){
      if(response) console.log(response);
    })
  }
}

///////////////////////////////////////////////
//Sockets
// var socket = io.connect('http://192.168.1.15:9000', {
//     //Wherever your sockets are configured to emit from. If using fullstack-generator, this will work out of the box.
//     path: '/socket.io-client',
//     transports: ['websocket'],
//     'force new connection': true
// });

// socket.on('thing:save', function(doc) {
//     console.log('received from socket', doc);
//     //whenever a thing is saved in your database, if you generated with angular-fullstack, it'll emit a socket that makes that thing available instantly.

//     //Since this is the background page, your content scripts or your popup won't be aware of it. That's why we're going to send a message. If you want to make this data available in a specific tab, you'll need to query all the tabs and find a specific id.
//     return chrome.tabs.sendMessage("NUMERICAL ID OF TAB YOU WANT TO RECEIVE", {
//         action: 'ENDPOINT_NAME:METHOD',
//         err: null,
//         data: doc
//     })
// });

//////////////////////////////////////////////
// This block listens to messages sent from your "externally connectable" website. Line 27 - manifest json. Right now it just logs and calls back.
var isLoggedIn = false, identity, token, musicPlaying;
chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
        console.log('WE ARE INSIDE OF MESSAGE EXTERNAL', arguments);
        if(arguments[0].action === 'LOGIN' && arguments[0].user) {
          isLoggedIn = true;
          identity = arguments[0].user;
          token = arguments[0].token;
        }
        if(arguments[0].action == 'LOGOUT') {
          isLoggedIn = false;
          identity = null;
        }
        if(arguments[0].action == 'PLAYERUPDATE') {
          musicPlaying = arguments[0].method;
        }
        if(arguments[0].action == 'PLAYERINIT') {
          musicPlaying = 'NOTHING';
        }
        sendResponse(200);
    });

//----------------------
// KEYBOARD SHORTCUTZ
//-----------------------
chrome.commands.onCommand.addListener(function(command) {
  $.ajax('http://192.168.1.148:9000/api/youtubes/player/pause')
          .done(function(){ })
});

//---------------------------------------------------
//---------   FOR COMM. WITH BROWSER ACTION  --------
//---------------------------------------------------

function currentSongs() {
  return currentSongsOnPage;
}

function currentPlaylists() {
  return currentPlaylistsOnPage;
}

function currentSpotPlaylists() {
  return currentSpotPlaylistsOnPage;
}

function isLoggedIntoApp() {
  return isLoggedIn;
}

function currentUser() {
  return identity;
}

function getToken() {
  return token;
}

function currentPlayerAction() {
  return musicPlaying;
}
