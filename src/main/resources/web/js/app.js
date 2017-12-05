var app = angular.module('app', ['ui.router','ngResource']);
app.config(function($stateProvider, $urlRouterProvider,$locationProvider) {
  $urlRouterProvider.otherwise('/invoices');
  $stateProvider
.state('invoices',{
  url: '/invoices',
 templateUrl: 'html/invoices.html',
controller: 'invoicesList'
})
.state('invoice',{
  url: '/invoices/:id',
 templateUrl: 'html/show.html',
controller: 'invoiceDetails'
})
.state('create',{
  url:'/create',
  templateUrl:'html/create.html',
  controller:'createInvoice'
})
.state('edit',{
  url:'/edit/:id',
  templateUrl:'html/create.html',
  controller:'editInvoice'
})
// $locationProvider.html5Mode(true);

});
