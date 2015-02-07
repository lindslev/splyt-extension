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
    $scope.clickedAddSong = false;

    if($scope.currentUser) {
      var req = {
        method: 'GET',
        url: 'http://192.168.1.121:9000/api/users/' + $scope.currentUser._id + '/playlists',
        headers: {
          'authorization': "Bearer " + token
        }
      }
      $http(req).success(function(playlists){
        $scope.userPlaylists = [];
        playlists.forEach(function(list){ if(list['friend_stream'] == false) $scope.userPlaylists.push(list); })
      })
    }

    $scope.addSong = function(song) {
      console.log('adding song', song);
      $scope.selectedSong = song;
      $scope.clickedAddSong = true;
    }

    $scope.addPlaylist = function(playlist) {
      console.log('adding playlist', playlist);
    }

    $scope.login = function() {
      window.open('http://192.168.1.121:9000/auth/google', '_blank');
    }

    $scope.addToPlaylist = function(playlist) {
      $scope.clickedAddSong = false;
      //add new song to server
      var req = {
        method: 'POST',
        url: 'http://192.168.1.121:9000/api/users/addSong/' + $scope.currentUser._id + '/playlist/' + playlist._id,
        headers: {
          'authorization': "Bearer " + token
        },
        data: $scope.selectedSong
      }
      console.log('testing...'),
      $http(req)
        .success(function(data){
          console.log('data back from server', data);
        })
        .error(function(err){
          console.log('err', err);
        })
    }
  });
