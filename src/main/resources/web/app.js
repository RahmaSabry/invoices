var app = angular.module('app', ['ui.router']);
app.config(function($stateProvider, $urlRouterProvider,$locationProvider) {
  $urlRouterProvider.otherwise('/invoices');
  $stateProvider
.state('invoices',{
  url: '/invoices',
 templateUrl: 'invoices.html',
controller: 'showInvoices'
})
.state('invoice',{
  url: '/invoices/:id',
 templateUrl: 'show.html',
 resolve:{Invoices:['$http', function($http) {
        return $http({
          method: 'GET',
          url: 'invoices.json'
        });
      }]},
controller: 'showSingleInvoice'
})
.state('create',{
  url:'/create',
  templateUrl:'create.html',
  controller:'createInvoice'
})
.state('edit',{
  url:'/edit/:id',
  templateUrl:'create.html',
  controller:'editInvoice'
})
// $locationProvider.html5Mode(true);

});

app.controller('showInvoices',['$scope','InvoiceService',function($scope,InvoiceService){
  $scope.invoices=InvoiceService.invoices;

  $scope.removeInvoice=function(id){
      var index=$scope.invoices.indexOf(InvoiceService.getSingleInvoice(id))
      $scope.invoices.splice(index, 1);
  }
}])
app.controller('showSingleInvoice',['$scope','$stateParams','InvoiceService',function($scope,$stateParams,InvoiceService){
   // var invoices=InvoiceService.invoices;
  $scope.invoice=InvoiceService.getSingleInvoice($stateParams.id);

  $scope.getTotal = function(){
  var sum = 0;
  for(var i = 0; i < $scope.invoice.items.length; i++){
      var item = $scope.invoice.items[i].price;
      sum += parseInt(item);
  }

  return sum;
}
}])
app.controller('createInvoice',['$scope','$stateParams','InvoiceService','$state',function($scope,$stateParams,InvoiceService,$state){
$scope.editButton=false;
$scope.createButton=true;
  var invoices = InvoiceService.invoices;
  $scope.items=[]
  $scope.addItem=function () {
    if ($scope.newItem!='') {
    $scope.items.push({'itemName':$scope.newItem,'price':$scope.price ,'done':false})
    $scope.newItem=''
    $scope.price=''
  }
  }
  $scope.deleteItem = function(index) {
  $scope.items.splice(index, 1);
}
  $scope.saveInvoice=function()
  {
  var id = invoices.length+1;
  var cname= $scope.cName;
  var address=$scope.address;
  var date = $scope.date;
  var phone=$scope.phone;
  var items=$scope.items;

  invoices.push({
    "id": id,
    "cName":cname,
    "address": address ,
    "date": date,
    "phone": phone,
    "items" :items

  })
  $state.go('invoices')
}
}])
app.controller('editInvoice',['$scope','$stateParams','InvoiceService','$state',function($scope,$stateParams,InvoiceService,$state){
  $scope.editButton=true;
  $scope.createButton=false;
  var invoice = InvoiceService.getSingleInvoice($stateParams.id);
  $scope.cName= invoice.cName;
  $scope.address= invoice.address;
  $scope.date= invoice.date;
  $scope.phone= invoice.phone;
  $scope.items= invoice.items;
     $scope.addItem=function () {
       if ($scope.newItem!='') {
       $scope.items.push({'itemName':$scope.newItem,'price':$scope.price ,'done':false})
       $scope.newItem=''
       $scope.price=''
                }
     }
     $scope.deleteItem = function(index) {
     $scope.items.splice(index, 1);
   }
   $scope.editInvoice=function(){
   invoice.cName=$scope.cName;
   invoice.address=$scope.address;
   invoice.date=$scope.date;
   invoice.phone=$scope.phone;
   invoice.items=$scope.items;
$state.go('invoices');
   }
}])

app.factory('InvoiceService',function () {

var invoices=[{
    "id":1 ,
    "cName":"Rahmaaaa",
    "address": "ras-sedr,southSina" ,
    "date": "12-12-2012",
    "phone": "0111111",
    "items" :[{"itemName":"laptop" ,
      "price":"5000"},
      {"itemName":"mobile phone" ,
       "price":"4000"},
       {"itemName":"Ipad" ,
        "price":"10000"}]

  },
  {
    "id":2,
    "cName":"ahmed",
    "address": "ras-sedr,southSina" ,
    "date": "12-12-2012",
    "phone": "0111111",
    "items" :[{"itemName":"laptop" ,
      "price":"5000"},{"itemName":"mobile phone" ,"price":"4000"}, {"itemName":"Ipad" ,"price":"10000"}]
},
  {
    "id":3 ,
    "cName":"muhammed",
    "address": "ras-sedr,southSina" ,
    "date": "12-12-2012",
    "phone": "0111111",
    "items" :[{"itemName":"laptop" ,
      "price":"5000"},{"itemName":"mobile phone",  "price":"4000"}, {"itemName":"Ipad" ,"price":"10000"}]
    }
      ]
     this.invoices=invoices;
     this.getSingleInvoice=function(id){
       for(var i=0 ; i<this.invoices.length;i++)
       {
         if(this.invoices[i].id==id)
         return this.invoices[i];
       }
     }

      return this
  })
