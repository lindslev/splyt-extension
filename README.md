Splyt - the Chrome extension
================

The extension side of the revolutionary Chrome music experience, where users can add songs from around the web to playlists and control the Splyt web app's player.

## Demo

[![ScreenShot](http://puu.sh/g1yqq/3034a266e5.png)](http://youtu.be/Q1AfK59BCjU)

## How it Works

When you go to any page on Chrome, the extension inspects the HTML of the page.. looking for audio, parsing its metadata, and making it addable to your playlists from the extension popup - accessible by clicking the headphones icon in your toolbar. You must log in to the app with your Google account to see the songs on the page and add them to any of your playlists. Since Spotify listening isn't yet supported anywhere on the web (without actually having Spotify open on your desktop), our player does not support Spotify songs you find on the web. However, if you come across a Spotify song, you can bookmark it on Splyt for later access. We hope to work with Spotify soon and allow you to add Spotify songs you find around the web to your native Spotify playlists. Lastly, when listening to music in the Splyt web app, you can pause/play music from the extension.

## Tech Specs

* Angular - the popup you see in the browser in a mini Angular app
* jQuery - useful in scraping the DOM for audio
* lodash - utility library for better controlling extension behavior

## The Other Side to Splyt
[Extension Repo](https://github.com/lindslev/splyt-extension)

## Contributors

* Emmie Salama [GitHub](https://github.com/es1831)
* Kamilla Khabibrakhmanova [GitHub](https://github.com/KamillaKhabibrakhmanova)
* Lindsay Levine [GitHub](https://github.com/lindslev)

## License

The MIT License (MIT)

Copyright (c) 2015 Lindsay Levine, Emmie Salama, Kamilla Khabibrakhmanova

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
