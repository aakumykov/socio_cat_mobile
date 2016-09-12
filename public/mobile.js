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
		.when('/new', {
			templateUrl : 'new.html'
		})
		.when('/edit', {
			templateUrl: 'edit.html'
		})
		.otherwise({
			templateUrl: 'list.html'
		})
		;
	}
);

app.controller('myCtrl', function($scope, $http){
	// переменныя
	$scope.pageTitle = '';

	$scope.card = {
		id: NaN,
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

	$scope.showModal = function(id){ 
		document.getElementById(id).style.display = 'block';
	}

	$scope.hideModal = function(id){ 
		document.getElementById(id).style.display = 'none';
	}

	// основныя функции
	$scope.loadList = function(){
		$http.get("/items").then(function(response) {
			$scope.list = response.data;
		});
	};

	$scope.showList = function(){
		$scope.pageTitle = 'Список карточек';
		$scope.loadList();
		$scope.goTo('#list');
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
				$scope.goTo('#show/'+data.id);
			},
			function errorCallback(response){
				alert("ошибка показа карточки "+response.data.id);
			}
		);
	};

	$scope.newItem = function(){
		$scope.pageTitle = 'Создание карточки';
		$scope.goTo('#new');
	}

	$scope.createItem = function(){
		var request = {
			"title": $scope.card.title,
			"content": $scope.card.content
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
		$http.get('/items/'+id).then(function(response) {
			var data = response.data;
			$scope.card = {
				id: data.id,
				title: data.title,
				content: data.content
			};
			$scope.pageTitle = 'Изменение карточки '+id;
			$scope.goTo('#edit');
		});
	};

	$scope.updateItem = function(){
		var id = $scope.card.id;
		
		var request = {
			"title": $scope.card.title,
			"content": $scope.card.content
		};

		$http.patch('/items/'+id, request).then(function(response){
			$scope.clearForm();
			$scope.showList();
		});
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

	$scope.cancelEdit = function(){
		$scope.goTo('#list');
		$scope.clearForm();
	};

	$scope.showList();
});