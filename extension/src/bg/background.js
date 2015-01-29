// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

//PUT YOUR IP ADDRESS HERE with http:// in front of it. It's important.
var Splyt = new Splyt('http://192.168.1.121:9000');
// var socket = io.connect('http://192.168.2.4:9000', {
//     path: '/socket.io-client',
//     transports: ['websocket'],
//     'force new connection': true
// });



//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });

chrome.tabs.onCreated.addListener(function(tabId, changeInfo, tab) {
    console.log('tab created test...!')
})
