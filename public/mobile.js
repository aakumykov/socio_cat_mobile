var app = angular.module('myApp',[]);
app.controller('myCtrl', function($scope, $http){
	$scope.title = 'Люди такие здесь';
	
  $scope.readData = function(){
    $http.post("processor.php",'{"command":"get"}').then(function(response) {
      $scope.persons = response.data;
    });
  };

  $scope.sendData = function(){
      var request = new Object;
          request.command = 'put';
          request.data = $scope.some_text;

      $http({
        method: 'POST',
        url: 'processor.php',
        data: request
      }).then(function successCallback(response) {
          $scope.resultMsg = 'УСПЕХ: '+response.status+', '+response.data;
          $scope.some_text = '';
        }, function errorCallback(response) {
          $scope.resultMsg = 'ОШИБКА: '+response.status+', '+response.data;
      });

      $scope.readData();
  };

  $scope.readData();
});