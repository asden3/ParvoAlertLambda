var AWS = require('aws-sdk');
var CognitoSDK = require('./amazon-cognito-identity.min.js');
AWS.CognitoIdentityServiceProvider.AuthenticationDetails = CognitoSDK.AuthenticationDetails;
AWS.CognitoIdentityServiceProvider.CognitoUserPool = CognitoSDK.CognitoUserPool;
AWS.CognitoIdentityServiceProvider.CognitoUser = CognitoSDK.CognitoUser;
global.navigator = () => null;

exports.handler = function index(event, context, callback) {
//AWS.config.region = "ap-southeast-2";

var authenticationData = {
    Username : event.email,
    Password : event.password,
};
var authenticationDetails = new AWS.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
var poolData = { 
                    UserPoolId : 'ap-southeast-2_FbqbUAeXA',
                    ClientId : '7ol8hn0eolq57v24jmf9t8ituk'
                };
//var userPool = new CognitoUserPool(poolData);
var userPool = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
var userData = {
                    Username : event.email,
                    Pool : userPool
                };
var cognitoUser = new AWS.CognitoIdentityServiceProvider.CognitoUser(userData);
cognitoUser.authenticateUser(authenticationDetails, {
        
        onSuccess: function (result) {
            //console.log('result=', result);
            var data = ('access token = ' + result.getAccessToken().getJwtToken());
            context.succeed(data);
        },
        onFailure: function(err) {
            context.fail(err);
        },
    });
}