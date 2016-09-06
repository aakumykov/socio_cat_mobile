var app = angular.module('myApp',[]);
app.controller('myCtrl', function($scope, $http){
  $scope.card = { 
    title: '', 
    content: '' 
  };

  $scope.readData = function(){
    $http.get("/items").then(function(response) {
      $scope.list = response.data;
    });
  };

  $scope.sendData = function(){
      var request = new Object;
          request.card_title = $scope.card.title;
          request.card_content = $scope.card.content;

      $http({
        method: 'POST',
        url: '/items/new',
        data: request
      }).then(function successCallback(response) {
          $scope.resultMsg = response.status+' ('+response.statusText+') '+response.data.message;
          $scope.card_title = '';
          $scope.card_content = '';
        }, function errorCallback(response) {
          $scope.resultMsg = response.status+' ('+response.statusText+') '+response.data.error;
      });

      $scope.readData();
  };

  $scope.readData();
});