var AWS = require('aws-sdk');

exports.handler = function index(event, context, callback) {
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

var params = {
  ClientId: "7ol8hn0eolq57v24jmf9t8ituk",
  Password: event.password,
  Username: event.email,
  UserAttributes: [
    {
      Name: 'custom:clinicName', 
      Value: event.clinicName
    },
    {
      Name: 'custom:phoneNumber',
      Value: event.phoneNumber
    },
    {
      Name: 'custom:address', 
      Value: event.address
    },
    {
      Name: 'custom:postcode', 
      Value: event.postcode
    },
    {
      Name: 'custom:cityTown',
      Value: event.cityTown
    }
  ]
};

cognitoidentityserviceprovider.signUp(params, function(err, data) {
  if (err) {
      console.log(err, err.stack);
      context.fail(err);
  } else {
      console.log(data);
      context.succeed(data);
  }
});




}