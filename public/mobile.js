var app = angular.module('myApp',['ngRoute']);

app.config(
	function($routeProvider) {
		$routeProvider
		.when('/', {
			templateUrl : 'list.html'
		})
		.when('/list', {
			templateUrl : 'list.html'
		})
		.when('/add', {
			templateUrl : 'add.html'
		})
		.otherwise({
			templateUrl: 'list.html'
		})
		;
	}
);

app.controller('myCtrl', function($scope, $http){
	// переменныя
	$scope.card = { 
		title: '', 
		content: '' 
	};

	// служебныя функции
	$scope.goTo = function(uri) {
		window.location = uri;
	}

	$scope.displayResult = function(type, text=''){
		// var color = 'black';
		// switch(type){
		// 	case 'info':
		// 		color = 'yellow';
		// 		break;
		// 	case 'success':
		// 		color = 'green';
		// 		break;
		// 	case 'error':
		// 		color = 'red';
		// 		break;
		// }

		// $scope.resultMsgColor = color;
		// $scope.resultMsgText = text;
	}

	$scope.clearForm = function(){
		$scope.card.title = '';
		$scope.card.content = '';
	}

	// основныя функции
	$scope.loadList = function(){
		$http.get("/items").then(function(response) {
			$scope.list = response.data;
		});
	};

	$scope.createItem = function(){
		var request = {
			"card_title": $scope.card.title,
			"card_content": $scope.card.content
		}

		$http({
			method: 'POST',
			url: '/items/new',
			data: request
		}).then(
			function successCallback(response) {
				$scope.clearForm();
				$scope.displayResult('success','карточка создана');
			},
			function errorCallback(response) {
				$scope.displayResult('error','ошибка создания карточки');
			},
			$scope.loadList(),
			$scope.goTo('#list')
		);
	};

	$scope.editItem = function(id){
		$scope.displayResult('info','изменение карточки '+id)
	};

	$scope.deleteItem = function(id){
		var html_id = '#card'+id;

		$http({
			method: 'DELETE',
			url: '/items/'+id
		}).then(
			function successCallback(response) {
				angular.element(html_id).remove();
				$scope.displayResult('success',"карточка "+id+" удалена");
			},
			function errorCallback(response) {
				$scope.displayResult('success',"ошибка удаления карточки "+id);
			}
		);
	};

	$scope.loadList();
});