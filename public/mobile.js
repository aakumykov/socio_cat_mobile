var NL="\n";

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
		.when('/show/:id', {
			templateUrl : 'show.html'
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

	$scope.showList = function(){
		$scope.loadList();
		window.location = '#list';
	};

	$scope.showItem = function(id){
		$http.get('/items/'+id).then(
			function successCallback(response){
				var data = response.data;
				$scope.current_card = {
					id: data.id,
					title: data.title,
					content: data.content
				};
				//alert("демонстрация карточки "+data.id+NL+data.title+NL+data.content);
				window.location = '#show/'+data.id;
			},
			function errorCallback(response){
				alert("ошибка показа карточки "+response.data.id);
			}
		);
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