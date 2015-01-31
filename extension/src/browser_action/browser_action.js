/* browser-action script */

'use strict';

console.log('browser action loaded');
var currentPage = chrome.extension.getBackgroundPage();

angular.module('splytApp', [])
  .controller('HomeCtrl', function ($http, $scope, $timeout) {
    $scope.songs = currentPage.currentSongs();
    $scope.playlists = currentPage.currentPlaylists();
    $scope.addSong = function(song) {
      console.log('adding song', song);
    }
    $scope.addPlaylist = function(playlist) {
      console.log('adding playlist', playlist);
    }
  });
