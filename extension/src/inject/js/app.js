modules.on('init', init)

function init() {
  console.log('app initialized')
}

////
/***
  ** start general embeds **
***/
////

modules.on('checkForEmbed', scrapeEmbed)

////
/***
  ** start Tumblr **
***/
////

modules.on('tumblrAudio', _.debounce(scrapeTumblr, 200))

////
/***
  ** start Reddit **
***/
////

modules.on('redditAudio', scrapeReddit)

////
/***
  ** start Facebook **
***/
////

modules.on('facebookAudio', _.debounce(scrapeFacebook, 2000))

////
/***
  ** start YouTube **
***/
////

modules.on('youtubeNative', _.debounce(scrapeYoutube, 200))

////
/***
  ** start Soundcloud **
***/
////
if(domainName().match(/soundcloud/g)) {
  chrome.runtime.sendMessage({
    action: 'soundcloudLoading',
    method: '',
    args : {}
  })
}

modules.on('soundcloudNative', _.debounce(scrapeSoundcloud, 200))

////
/***
  ** start Twitter **
***/
////

modules.on('twitterAudio', _.debounce(scrapeTwitter, 2000))
