/* browser-action script */

'use strict';

var currentPage = chrome.extension.getBackgroundPage();
var link = 'splytmusic.herokuapp.com';

angular.module('splytApp', [])
  .controller('HomeCtrl', function ($http, $scope, $timeout) {
    $scope.songs = currentPage.currentSongs();
    $scope.playlists = currentPage.currentPlaylists();
    $scope.spotPlaylists = currentPage.currentSpotPlaylists();
    $scope.isLoggedIn = currentPage.isLoggedIntoApp();
    $scope.currentUser = currentPage.currentUser();
    var token = currentPage.getToken();
    $scope.clickedAddSong = false, $scope.clickedAddSpotify = false;
    $scope.musicPlayingInApp = currentPage.currentPlayerAction();

    if($scope.currentUser) {
      var req = {
        method: 'GET',
        url: 'http://' + link + '/api/users/' + $scope.currentUser._id + '/playlists',
        headers: {
          'authorization': "Bearer " + token
        }
      }
      $http(req).success(function(playlists){
        $scope.userPlaylists = [];
        playlists.forEach(function(list){
          if(list['friend_stream'] == false && list.title !== 'Spotify Bookmarks') $scope.userPlaylists.push(list);
          if(list.title == 'Spotify Bookmarks') $scope.userSpotify = list;
        })
      })
    }

    $scope.addSong = function(song) {
      $scope.clickedAddSpotify = $scope.clickedAddSong = false;
      $scope.selectedSong = song;
      song.action == 'newSpotifySong' ? $scope.clickedAddSpotify = true : $scope.clickedAddSong = true;
    }

    // $scope.addPlaylist = function(playlist) {
    //   alert('Ability to add playlists coming soon!');
    // }

    $scope.login = function() {
      window.open('https://' + link + '/auth/google', '_blank');
    }

    $scope.addToPlaylist = function(playlist) {
      $scope.clickedAddSong = false;
      //add new song to server
      var req = {
        method: 'POST',
        url: 'http://' + link + '/api/users/addSong/' + $scope.currentUser._id + '/playlist/' + playlist._id,
        headers: {
          'authorization': "Bearer " + token
        },
        data: $scope.selectedSong
      }

      $http(req)
        .success(function(data){
          console.log('data back from server', data);
        })
        .error(function(err){
          console.log('err', err);
        })
    }

    $scope.addToSpotify = function() {
      $scope.clickedAddSpotify = false;
      var req = {
        method: 'POST',
        url: 'http://' + link + '/api/users/addSong/' + $scope.currentUser._id + '/playlist/' + $scope.userSpotify._id,
        headers: {
          'authorization': "Bearer " + token
        },
        data: $scope.selectedSong
      }

      $http(req)
        .success(function(data){
          console.log('data back from server', data);
        })
        .error(function(err){
          console.log('err', err);
        })
    }

    $scope.cancel = function() {
      $scope.clickedAddSong = false;
    }

    $scope.controlPlayer = function() {
      var action;
      if($scope.musicPlayingInApp !== 'NOTHING') {
        if($scope.musicPlayingInApp) {
          $scope.musicPlayingInApp = false;
          action = 'play';
        } else {
          $scope.musicPlayingInApp = true;
          action = 'pause';
        }
      }
      $http.post('http://' + link + '/api/youtubes/player/' + action, $scope.currentUser)
          .success(function(){ })
    }
  });
