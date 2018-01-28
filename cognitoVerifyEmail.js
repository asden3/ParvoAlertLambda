var AWS = require('aws-sdk');


exports.handler = function index(event, context, callback) {
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

var params = {
  ClientId: '7ol8hn0eolq57v24jmf9t8ituk', 
  ConfirmationCode: event.ConfirmationCode, 
  Username: event.Username
};


cognitoidentityserviceprovider.confirmSignUp(params, function(err, data) {
  if (err) {
      console.log(err, err.stack);
      context.fail(err);
  } else {
      console.log(data);
      context.succeed(data);
  }
});
}
