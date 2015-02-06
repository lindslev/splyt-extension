/* browser-action script */

'use strict';

console.log('browser action loaded');
var currentPage = chrome.extension.getBackgroundPage();

angular.module('splytApp', [])
  .controller('HomeCtrl', function ($http, $scope, $timeout) {
    $scope.songs = currentPage.currentSongs();
    $scope.playlists = currentPage.currentPlaylists();
    $scope.spotPlaylists = currentPage.currentSpotPlaylists();
    $scope.isLoggedIn = currentPage.isLoggedIntoApp();
    $scope.currentUser = currentPage.currentUser();
    var token = currentPage.getToken();

    $scope.addSong = function(song) {
      console.log('adding song', song);
      console.log('document.cookie', document.cookie)
      var req = {
        method: 'POST',
        url: 'http://192.168.1.121:9000/api/users/addSong/' + $scope.currentUser._id +'/playlist/'+ $scope.currentUser.playlist[0],
        headers: {
          'authorization': "Bearer " + token
        },
        data: song
      }

      $http(req)
        .success(function(data){
          console.log('data back from server', data);
        })
      // $http.post('http://192.168.1.121:9000/api/users/addSong/' + $scope.currentUser._id +'/playlist/'+ $scope.currentUser.playlist[0], song)
      //   .success(function(data){
      //     console.log(data);
      //   })
    }
    $scope.addPlaylist = function(playlist) {
      console.log('adding playlist', playlist);
    }
    $scope.login = function() {
      window.open('http://192.168.1.121:9000/auth/google', '_blank');
    }
  });
