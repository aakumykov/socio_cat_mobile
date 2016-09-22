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
			templateUrl : 'show.html',
		})
		.when('/new', {
			templateUrl: 'new.html',
			headers: 'Max-Age: 0',
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

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
                console.log('file changed: '+scope.myFile.name);
            });
        }
    };
}]);

app.controller('myCtrl', function($scope, $http){
	// переменныя
	$scope.pageTitle = '';


	$scope.blankCard = {
		id: NaN,
		title: '',
		content: ''
	};

	$scope.card = $scope.blankCard;


	//$scope.myFile = {};


	$scope.cardForm = {
		button: 'Просто кнопка',
		action: function(){
			var msg = 'Не задано действие для формы';
			alert(msg);
			console.log(msg);
		},
	};


	// служебныя функции
	$scope.goTo = function(uri) {
		window.location = uri;
	}

	$scope.displayResult = function(type, text=''){
	}

	$scope.createCardForm = function(mode=''){
		if ('new'==mode) {
			$scope.cardForm.button = 'Создать';
			$scope.cardForm.action = function(){ 
				$scope.createItem(); 
			}
		}
		else if ('edit'==mode) {
			$scope.cardForm.button = 'Сохранить';
			$scope.cardForm.action = function(){ 
				$scope.updateItem();
			}
		}
		else {
			console.log("createCardForm(): invalid mode '"+mode+"'");
		}

		return 'card_form.html';
	}

	$scope.clearForm = function(){
		$scope.card = $scope.blankCard;
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
				var card = response.data;
				
				$scope.current_card = card;
				//alert('showItem('+id+')'+NL+card.id+NL+card.title+NL+card.content);
				
				$scope.pageTitle = 'Карточка «'+card.title+'»';
				
				$scope.goTo('#show/'+card.id);
			},
			function errorCallback(response){
				alert("ошибка показа карточки "+card.id);
			}
		);
	};

	$scope.newItem = function(){
		$scope.pageTitle = 'Создание карточки';
		$scope.goTo('#new');
	}

	$scope.createItem = function(){
		var formData = new FormData();
        	formData.append('title', this.card.title);
        	formData.append('content', this.card.content);
        	if (this.myFile) formData.append('avatar', this.myFile);

        	alert(this.myFile.name);

		$http.post('/items/new', formData,{ 
			transformRequest: angular.identity, 
			headers: {'Content-Type': undefined}
		}).then(
			function successCallback(response) {
				$scope.clearForm();
				$scope.displayResult('success','карточка создана');
			},
			function errorCallback(response) {
				$scope.displayResult('error','ошибка создания карточки');
			},
			$scope.showList()
		);
	};

	$scope.editItem = function(id){
		$http.get('/items/'+id).then(function(response) {
			var data = response.data;
			$scope.card = {
				id: data.id,
				title: data.title,
				content: data.content,
				avatar: {
					preview: data.avatar.preview,
					original: data.avatar.orig,
					thumbnail: data.avatar.thumbnail,
				},
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
		//alert('deleteItem('+id+')');

		var html_id = '#card'+id;

		$http({
			method: 'DELETE',
			url: '/items/'+id
		}).then(
			function successCallback(response) {
				//angular.element(html_id).remove();
				$scope.displayResult('success',"карточка "+id+" удалена");
				$scope.showList();
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

	$scope.modal = {
		title: 'Модальное окно',
		description: '',
		
		color: 'black',
		yes_arg: NaN,
		no_arg: NaN,
		
		yes_callback: function(){},
		no_callback: function(){},
		
		yesCallback: function(){ 
			//alert('scope.modal.yesCallback, '+this.yes_arg);
			this.yes_callback(this.yes_arg);
			this.hide();
		},
		noCallback: function(){ 
			//alert('scope.modal.noCallback, '+this.no_arg);
			this.no_callback(this.no_arg);
			this.hide();
		},

		show: function(){ document.getElementById('modalWindow').style.display = 'block'; },
		hide: function(){ document.getElementById('modalWindow').style.display = 'none'; },
	};

	$scope.createModal = function(opt){
		//alert('createModal(opt.yes.arg:'+opt.yes.arg+')');
		
		var modal = $scope.modal;
			modal.yes_arg = opt.yes.arg;
			modal.yes_callback = opt.yes.callback;
			//modal.no_arg = opt.no.arg;
			//modal.no_callback = opt.no.callback;

			modal.title = opt.title;
			modal.description = opt.description;
			modal.color = opt.color;

		//alert($scope.yesArg+NL+$scope.noArg);

		modal.show();
	};

	$scope.deleteModal = function(id){
		//alert('deleteModal('+id+')');

		$scope.createModal({
			title: 'Удалить карточку №'+id+'?',
			description: '',
			color: 'red',
			yes: {
				arg: id,
				callback: function(){
					$scope.deleteItem(id);
				}
			},
		});
	};



	$scope.showList();
});