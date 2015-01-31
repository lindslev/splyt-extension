//PUT YOUR IP ADDRESS HERE with http:// in front of it. It's important, at least for DEV environments.
//When you're in production, make sure that your production url's reflected here.
var Splyt = new Splyt('http://192.168.1.121:9000');

// Splyt is essentially a resource at this point and you can run methods on it like:
// Splyt.Endpoint().GET(arguments,callback);

// Chrome runtime expects to be sent an object ('message' in the example below) with keys:
// action - the endpoint you want to target, like comment, item, user, etc
// method - get,post,update, or delete.
// args - an object containing the data you need to send in request body or params.

var currentSongsOnPage = [], currentPlaylistsOnPage = [];
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    console.log('did we receive a msg from the content?', message)
    if(message.action == 'newSong') currentSongsOnPage.push(message.args);
    if(message.action == 'newPlaylist') currentPlaylistsOnPage.push(message.args);





    /*** for talking to splytAPI & server ***/
    //Given the message = {
    //  action: 'Endpoint',
    //  method: 'GET',
    //  args: {
    //    _id: '123456787'
    //  }
    // }

    // Background.js will always send back an object with the action of the ORIGINAL message it was sent ('Endpoint' in this case), the data of the server response, and an err if any.
    // chrome.tabs.sendMessage(sender.tab.id, {
    //  action: message.action,
    //  data: data,
    //  err: err
    // });
})

////////////////////////////////////////////////////////////////////////
// Whenever you open a new tab or go to a new page from an existing tab, and it finishes loading, send a message to that tab telling the app to initialize.
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
      if (changeInfo.status && changeInfo.status == 'complete') {
        runChecks(tabId)
      //   chrome.tabs.sendMessage(tabId, {
      //       action: 'checkForEmbed',
      //       err: null,
      //       data: null
      //   }, function(response) {
      //       if (response) console.log(response);
      //   });
      }
  })

/////////////////////////////////////////////
// Fires when the active tab in a window changes
chrome.tabs.onActivated.addListener(function(changeInfo){
  console.log('inside onActivated', changeInfo.tabId)
  runChecks(changeInfo.tabId)
  // chrome.tabs.sendMessage(changeInfo.tabId, {
  //           action: 'checkForEmbed',
  //           err: null,
  //           data: null
  //       }, function(response) {
  //           console.log('inside response')
  //           if (response) console.log(response);
  //       });
})

///////////////////////////////////////////
// Run checks on tab change && page load
function runChecks(tabId) {
  currentSongsOnPage = [];
  currentPlaylistsOnPage = [];
  chrome.tabs.sendMessage(tabId, {
            action: 'checkForEmbed',
            err: null,
            data: null
        }, function(response) {
            console.log('inside response')
            if (response) console.log(response);
        });
}

///////////////////////////////////////////////
//Sockets
var socket = io.connect('http://192.168.1.15:9000', {
    //Wherever your sockets are configured to emit from. If using fullstack-generator, this will work out of the box.
    path: '/socket.io-client',
    transports: ['websocket'],
    'force new connection': true
});

socket.on('thing:save', function(doc) {
    console.log('received from socket', doc);
    //whenever a thing is saved in your database, if you generated with angular-fullstack, it'll emit a socket that makes that thing available instantly.

    //Since this is the background page, your content scripts or your popup won't be aware of it. That's why we're going to send a message. If you want to make this data available in a specific tab, you'll need to query all the tabs and find a specific id.
    return chrome.tabs.sendMessage("NUMERICAL ID OF TAB YOU WANT TO RECEIVE", {
        action: 'ENDPOINT_NAME:METHOD',
        err: null,
        data: doc
    })
});

//////////////////////////////////////////////
// This block listens to messages sent from your "externally connectable" website. Line 27 - manifest json. Right now it just logs and calls back.
chrome.runtime.onMessageExternal.addListener(
    function(request, sender, sendResponse) {
        console.log(arguments);
        sendResponse(200);
    });


//---------------------------------------------------

function currentSongs() {
  return currentSongsOnPage;
}

function currentPlaylists() {
  return currentPlaylistsOnPage;
}
