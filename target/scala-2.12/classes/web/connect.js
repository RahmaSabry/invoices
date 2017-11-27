	angular.module('myapp', [])
.controller('MyController', function($scope, $http) {
    $http.get('https://www.google.com.eg/').
        then(function(response) {
            $scope.items = response.data;
        });
});
//function MyController($scope, $http) {
//
//    $scope.items = [];
//    $scope.getItems = function() {
//
//        $http({method : 'GET',url : 'http://localhost:5000/questions/test'})
//            .success(function(data, status) {
//                    $scope.items = data;
//            })
//            .error(function(data, status) {
//                alert("Error");
//            });
//    };
//}