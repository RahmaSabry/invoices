describe('Unit Test', function () {
  beforeEach(function () {
    module('resourceApp');
  });
var mock_response=[{"userName":"rahma","email":"a@gmail.com","password":"rahma"}];
var $httpBackend
var RegisterService;
var users
beforeEach(inject(function(_$httpBackend_,_RegisterService_){
                $httpBackend=_$httpBackend_
                RegisterService=_RegisterService_
}))
afterEach(function() {
    $httpBackend.verifyNoOutstandingRequest();
    $httpBackend.verifyNoOutstandingExpectation();
});
describe('service: Register', function () {
it('have Users',function(){
$httpBackend.whenGET('http://localhost:5000/register').respond(mock_response)
    RegisterService.query().$promise.then(function(data){users=data
},function(error){users=error})
    $httpBackend.flush()
expect(users.userName).toBe(mock_response.userName);
})
})
});
