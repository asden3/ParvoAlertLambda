var AWS = require('aws-sdk');

exports.handler = function(event, context, callback) {
    
var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();   

var user =  event.cognitoSubNumber;
    
var params = {
  UserPoolId: "ap-southeast-2_FbqbUAeXA",
  Username: event.cognitoSubNumber
};

cognitoidentityserviceprovider.adminDeleteUser(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});

};
