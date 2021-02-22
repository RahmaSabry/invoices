angular.module( 'app',['resourceApp','invoiceControllers'])
.config(function($stateProvider, $urlRouterProvider,$locationProvider) {
  $urlRouterProvider.otherwise('/invoices');
  $stateProvider
.state('invoices',{
  url: '/invoices',
 templateUrl: 'html/invoices.html',
controller: 'invoicesList'
})
.state('register',{
url:'/register',
templateUrl:'html/register.html',
controller:'registerController',
})
.state('login',{
url:'/login',
templateUrl:'html/login.html',
controller:'logInController',

})
.state('invoice',{
url: '/invoices/:id',
templateUrl: 'html/show.html',
controller: 'invoiceDetails',
resolve:{
invoiceDetails:function(InvoiceService,$stateParams){
return InvoiceService.get({id:$stateParams.id})}
}
})
.state('create',{
  url:'/create',
  templateUrl:'html/newInvoice.html',
  controller:'newInvoiceController'
})
.state('edit',{
  url:'/edit/:id',
  templateUrl:'html/newInvoice.html',
  resolve:{
  invoiceDetails:function(InvoiceService,$stateParams){
  return InvoiceService.get({id:$stateParams.id})}
  },
  controller:'editingInvoiceController',
})
// $locationProvider.html5Mode(true);
})
.run(function($rootScope,$http,$cookies,$state) {
 $rootScope.globals = $cookies.getObject('globals') || {};
    if ($rootScope.globals.currentUser) {
        $rootScope.login=true;
        $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
        $state.go('invoices')
   }
$rootScope.$on('$locationChangeStart', function (event, next, current) {
var loggedIn = $rootScope.globals.currentUser;
currentState=$state.current.name
if (currentState!="register"&&!loggedIn) {$state.go('login');} });
})