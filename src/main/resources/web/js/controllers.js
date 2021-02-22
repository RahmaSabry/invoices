/**
Controller for view the invoices list
get the $resource from InvoiceService
**/
angular.module('invoiceControllers',['ui.router','resourceApp','ngMaterial','ngAnimate'])
.controller('invoicesList',['$scope','InvoiceService','$state',function($scope,InvoiceService,$state ){
    $scope.invoices=[];
    var invoices= InvoiceService.query()
    console.log(invoices)
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
.controller('invoiceDetails',['$scope','invoiceDetails',function($scope,invoiceDetails){
  $scope.invoiceWithItems={}
  $scope.total=0
  $scope.items=[]
  invoiceDetails.$promise.then(function(data){
  $scope.invoiceWithItems=data;
  $scope.invoice=$scope.invoiceWithItems.invoice
  $scope.items=$scope.invoiceWithItems.items
    $scope.total=getTotal();
  })
    function getTotal(){
    var items= $scope.invoiceWithItems.items;
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
.controller('newInvoiceController',['$scope','InvoiceService','$state','ItemService',function($scope,InvoiceService,$state,ItemService){
    $scope.editButton=false;
    $scope.createButton=true;
    $scope.selectedItems=[]
    var itemsID=[]
//    $scope.toggleSideMenu = function($event){
//    $event.preventDefault();
//    $scope.closed=!$scope.closed;
//};
   $scope.openMenu=function(){
   if($scope.menuList) $scope.menuList=false
   else if (!$scope.menuList)$scope.menuList=true;
    }
    $scope.addSelectedItem=function(itemID,index){
    $scope.selectedItems.push({'itemName':$scope.items[index].itemName,'price':parseInt($scope.items[index].price)})
    itemsID.push(itemID)
        console.log($scope.selectedItems)
    }
$scope.items = ItemService.query();
  $scope.deleteItem = function(index) {
  $scope.selectedItems.splice(index, 1);
  itemsID.splice(index,1)
}
  $scope.saveInvoice=function()
  {
  var id =$scope.id;
  var clientName= $scope.clientName;
  var address=$scope.address;
  var date = $scope.date;
  var phone=$scope.phone;
  var items=$scope.items;
if(itemsID.length>0)
{
    var newInvoice ={
    "invoice":{
      "invoiceID": -1,
      "clientName":clientName,
      "address": address ,
      "date": date,
      "phoneNumber": phone,
      },
      "itemsID":itemsID
    }
    InvoiceService.save(newInvoice)
    console.log(newInvoice)
  $state.go('invoices')
}
else{
    $scope.emptyItems=true;
    $scope.message="Please select item!"
}
}
}])
/**

Edit invoice
*/
.controller('editingInvoiceController',['$scope','$stateParams','InvoiceService','$state','ItemService','invoiceDetails',function($scope,$stateParams,InvoiceService,$state,ItemService,invoiceDetails){
    $scope.editButton=true;
    $scope.createButton=false;
    $scope.invoice={}
    $scope.items=[];
    var itemsID=[]
    invoiceDetails.$promise.then(function(data){
    var invoice=data.invoice;
    $scope.id=invoice.invoiceID;
    $scope.clientName= invoice.clientName;
    $scope.address= invoice.address;
    $scope.date= invoice.date;
    $scope.phone= invoice.phoneNumber;
    $scope.selectedItems= data.items;
    angular.forEach($scope.selectedItems,function(value,key){
    itemsID.push(value.itemID)})
})
 $scope.items = ItemService.query();
 $scope.openMenu=function(){
    if($scope.menuList) $scope.menuList=false
    else if (!$scope.menuList)$scope.menuList=true;
     }
     $scope.addSelectedItem=function(itemID,index){
     $scope.selectedItems.push({'itemName':$scope.items[index].itemName,'price':parseInt($scope.items[index].price)})
     itemsID.push(itemID)
     console.log($scope.selectedItems)
     }
   $scope.deleteItem = function(index) {
   $scope.selectedItems.splice(index, 1);
   itemsID.splice(index,1)
 }
   console.log($scope.id)

   $scope.editInvoice=function(){
   if(itemsID.length>0){
   var invoice=$scope.invoice;
   var updateInvoice ={
       "invoice":{
         "invoiceID": parseInt($stateParams.id),
         "clientName":$scope.clientName,
         "address": $scope.address ,
         "date": $scope.date,
         "phoneNumber": $scope.phone,
         },
         "itemsID":itemsID
       }
   InvoiceService.update({id:$stateParams.id},updateInvoice)
    $state.go('invoices',{id: 0}, {reload : true});}
    else{
    $scope.emptyItems=true;
    $scope.message="Please select item!"}
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