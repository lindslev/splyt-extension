chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------

	}
	}, 10);
});

console.log('isjdijsdijsid')
// $('a').css({
//   'background':'yellow'
// });

// chrome.tabs.query({}, function(tabs) {
//         tabs.forEach(function(tab) {
//           if(tab.url.match(/thissongissick/g)) {
//             $('a').css({
//               'background':'yellow'
//             });
//             console.log('$a', $('a'))
//             // $.ajax({ url: tab.url,
//             //         success: function(data) {
//             //           console.log('tab html?', data)
//             //         }
//             // });
//           }
//         })
//     });

chrome.extension.onMessage.addListener(function (message, sender, sendResponse) {
  console.log('messsage', message)
  if (message.method == 'testTabFind') {
    console.log('got the message')
  }
  sendResponse({sianara:'deuces'});
});

// chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
//   console.log(response.farewell);
// });
