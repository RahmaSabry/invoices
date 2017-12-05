/**
Controller for view the invoices list
get the $resource from InvoiceService
**/
app.controller('invoicesList',['$scope','InvoiceService','$state',function($scope,InvoiceService,$state){

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
app.controller('invoiceDetails',['$scope','$stateParams','InvoiceService','$http',function($scope,$stateParams,InvoiceService,$http){
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
/**

create new invoice

**/
app.controller('createInvoice',['$scope','InvoiceService','$state',function($scope,InvoiceService,$state){
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

app.controller('editInvoice',['$scope','$stateParams','InvoiceService','$state',function($scope,$stateParams,InvoiceService,$state){
  $scope.editButton=true;
  $scope.createButton=false;
  $scope.invoice={}
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
       $scope.items.push({'itemName':$scope.newItem,'price':$scope.price ,'done':false})
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
