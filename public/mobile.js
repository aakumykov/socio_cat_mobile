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
					$scope.card.title = '';
					$scope.card.content = '';
				}, function errorCallback(response) {
					$scope.resultMsg = response.status+' ('+response.statusText+') '+response.data.error;
			});

			$scope.readData();
	};

	$scope.deleteItem = function(id){
		//alert('deleteItem '+id);

		$http({
			method: 'DELETE',
			url: '/items/'+id
		}).then(
			function successCallback(response) {
				var target_id = '#card'+id;

				var msg = response.data.message;

				if ('success'==msg.type) {
					angular.element(target_id).remove();
					var msg_prefix = 'УСПЕХ';
					var msg_text = msg.text;
				} else {  
					var msg_prefix = 'ОШИБКА';
					var msg_text = msg.text;
				}

				$scope.resultMsg = msg_prefix + ': ' + msg_text;
			},
			function errorCallback(response) {
				var msg_prefix = 'ОШИБКА';
				var msg_text = response.status+' ('+response.statusText+') '+response.data.error;

				$scope.resultMsg = msg_prefix + ': ' + msg_text;
			}
		);
	};

	$scope.readData();
});