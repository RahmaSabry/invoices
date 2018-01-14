/**
Controller for view the invoices list
get the $resource from InvoiceService
**/
angular.module('invoiceControllers',['ui.router','resourceApp'])
.controller('invoicesList',['$scope','InvoiceService','$state',function($scope,InvoiceService,$state ){
    $scope.invoices=[];
    var invoices= InvoiceService.query()
    $scope.invoices=invoices;
    $scope.removeInvoice=function(id){
    InvoiceService.remove({id:id},function(){
    $state.go('invoices',{id: 0}, {reload : true});
    })
  }
}])
/*
view the invoice details
get specific invoice by id got from $stateParams
*/
.controller('invoiceDetails',['$scope','$stateParams','InvoiceService','$http',function($scope,$stateParams,InvoiceService,$http){
  $scope.invoice={}
  $scope.total=0
  InvoiceService.get({id:$stateParams.id}).$promise.then(function(data){

  $scope.invoice=data;
       var items= $scope.invoice.items;

    $scope.total=getTotal();
  })
     function getTotal(){
       var items= $scope.invoice.items;
             var sum = 0;
             for(var i = 0; i <items.length; i++){
                 var item = items[i].price;
                 sum += item;
             }
             return sum; }
}])
.directive('invoiceDetails',function(){
return{
restrict:'E',
templateUrl:'html/invoiceDetails.html'
}
})
/**
create new invoice
**/
.controller('createInvoice',['$scope','InvoiceService','$state',function($scope,InvoiceService,$state){
$scope.editButton=false;
$scope.createButton=true;

  $scope.items=[]
  $scope.addItem=function () {
    if ($scope.newItem!='') {
    $scope.items.push({'itemName':$scope.newItem,'price':parseInt($scope.price) ,'done':false})
    $scope.newItem=''
    $scope.price=''
  }
  }
  $scope.deleteItem = function(index) {
  $scope.items.splice(index, 1);
}
  $scope.saveInvoice=function()
  {

  var id =$scope.id;
  var clientName= $scope.clientName;
  var address=$scope.address;
  var date = $scope.date;
  var phone=$scope.phone;
  var items=$scope.items;
   var data={
      "id": parseInt(id),
      "clientName":clientName,
      "address": address ,
      "date": date,
      "phoneNumber": phone,
      "items" :items

    }
    InvoiceService.save(data)
  $state.go('invoices')

}
}])
/**

Edit invoice
*/
.controller('editInvoice',['$scope','$stateParams','InvoiceService','$state',function($scope,$stateParams,InvoiceService,$state){
  $scope.editButton=true;
  $scope.createButton=false;
  $scope.invoice={}
  $scope.items=[];
InvoiceService.get({id:$stateParams.id}).$promise.then(function(invoice){
    $scope.invoice=invoice;
    $scope.id=invoice.id;
    $scope.clientName= invoice.clientName;
    $scope.address= invoice.address;
    $scope.date= invoice.date;
    $scope.phone= invoice.phoneNumber;
    $scope.items= invoice.items;
})
 $scope.addItem=function () {
    if ($scope.newItem!='') {
    $scope.items.push({'itemName':$scope.newItem,'price':parseInt($scope.price) ,'done':false})
    $scope.newItem=''
    $scope.price=''
  }
  }
  $scope.deleteItem = function(index) {
  $scope.items.splice(index, 1);
}
   $scope.editInvoice=function(){
   var invoice=$scope.invoice;
   invoice.clientName=$scope.clientName;
   invoice.address=$scope.address;
   invoice.date=$scope.date;
   invoice.phone=$scope.phone;
   invoice.items=$scope.items;
   InvoiceService.update({id:$stateParams.id},invoice)
    $state.go('invoices',{id: 0}, {reload : true});
   }
}])
.controller('mainController',function($scope,$cookies,$rootScope,LoginService,$state){
$scope.userName=""
if($cookies.getObject('globals')){
$scope.login=true;
$scope.userName=$cookies.getObject('globals').currentUser.username}
$scope.logout=function(){
LoginService.removeCredentials()
$scope.login=false
$state.go('login');
}
})
.controller('registerController',function($scope,RegisterService,LoginService,$state){
$scope.register=function()
  {
  var email= $scope.email;
  var userName =$scope.userName;
  var password= $scope.password;
  var data={
  "userName":userName,
  "email":email,
  "password":password
  }
  saveUser(data);
  }
  function saveUser(data)
  {
  RegisterService.save(data,function(response){
    $state.go('login')
  },function(error){
  if(error.status==409)
  $scope.error=true;
  $scope.message="User name :"+userName+" is already taken!"
  })
  }
})
.controller('logInController',function($scope,LoginService,$log,$http,$location,$state){
$scope.signIn=function()
  {
  var userName =$scope.userName;
  var password= $scope.password;
  var data={
  "userName":userName,
  "password":password
  }
LoginService.resource.save(data,function(response){
LoginService.setCredentials(userName,password)
    $state.go('invoices',{id: 0}, {reload : true});
 },function(error){
     $scope.error=true;
     if(error.status=="401")
     {$scope.message="username or password is incorrect!"}
 })
}
})