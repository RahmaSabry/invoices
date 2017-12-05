
app.factory('InvoiceService',function ($http,$resource) {


      return $resource('http://localhost:5000/invoices/:id',null, {'update': { method:'PUT' }},{    stripTrailingSlashes: false})
  })
