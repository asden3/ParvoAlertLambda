var AWS = require('aws-sdk');


exports.handler = function index(event, context, callback) {
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

var params = {
  AccessToken: event.accessToken
};

cognitoidentityserviceprovider.globalSignOut(params, function(err, data) {
  if (err) {
    console.log(err, err.stack);
    context.fail(err);
  } else {
    console.log(data);
    context.succeed(data);
  }
});
  
}