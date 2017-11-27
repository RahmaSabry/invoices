var app = angular.module('app',[])
app.controller('invoicesController',['$scope','$http',function ($scope,$http) {

  $http.get('invoices.json').then(function(response){
    $scope.invoices=response.data;
  });
  }]);
