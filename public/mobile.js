var app = angular.module('myApp',[]);
app.controller('myCtrl', function($scope, $http){
	$scope.title = 'Карточки';
	
  $scope.readData = function(){
    $http.get("/items").then(function(response) {
      $scope.list = response.data;
    });
  };

  $scope.sendData = function(){
      var request = new Object;
          request.card_title = $scope.card_title;
          request.card_content = $scope.card_content;

      $http({
        method: 'POST',
        url: '/items/new',
        data: request
      }).then(function successCallback(response) {
          $scope.resultMsg = 'УСПЕХ: '+response.status+', '+response.data;
          $scope.card_title = '';
          $scope.card_content = '';
        }, function errorCallback(response) {
          $scope.resultMsg = 'ОШИБКА: '+response.status+', '+response.data;
      });

      $scope.readData();
  };

  $scope.readData();
});