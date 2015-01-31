/* browser-action script */

'use strict';

console.log('browser action loaded');
var currentPage = chrome.extension.getBackgroundPage();

angular.module('splytApp', [])
  .controller('HomeCtrl', function ($http, $scope, $timeout) {
    $scope.songs = currentPage.currentSongs();
    console.log($scope.songs)
  });
