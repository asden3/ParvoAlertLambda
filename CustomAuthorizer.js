// A simple TOKEN authorizer example to demonstrate how to use an authorization token 
// to allow or deny a request. In this example, the caller named 'user' is allowed to invoke 
// a request if the client-supplied token value is 'allow'. The caller is not allowed to invoke 
// the request if the token value is 'deny'. If the token value is 'Unauthorized', the function 
// returns the 'Unauthorized' error with an HTTP status code of 401. For any other token value, 
// the authorizer returns an 'Invalid token' error. 

exports.handler =  function(event, context, callback) {
    var Authorization = false;
    var token = event.authorizationToken.split(' ');
    if(token[0] === 'Bearer')
    {
        //console.log(token[1]);
        var splitToken = token[1].split(".");
        //console.log(splitToken[1]);
        var claims = new Buffer(splitToken[1], 'base64').toString('ascii')
        //console.log(claims);
        var claimsobj = JSON.parse(claims);
        console.log(claimsobj);
        console.log(claimsobj['cognito:groups']);
        var userGroups = claimsobj['cognito:groups'];
        console.log(userGroups);
        var userSub = claimsobj.sub;
        console.log(userSub);

        if (userGroups.indexOf("admin") > -1) 
        {
            callback(null, generatePolicy(userSub, 'Allow', event.methodArn));
        }
        else if (userGroups.indexOf("researcher") > -1) 
        {
            callback(null, generatePolicy(userSub, 'Allow', event.methodArn));
        }
        else if (userGroups.indexOf("clinic") > -1) 
        {
            callback(null, generatePolicy(userSub, 'Allow', event.methodArn));
        }
        else if (userGroups.indexOf("non-clinic") > -1)
        {
            callback(null, generatePolicy(userSub, 'Allow', event.methodArn));
        }
        else
        {
            callback("Unauthorized")
        }
    } 
    else 
    {
		// Require a "Bearer" token
		console.log('Wrong token type', token[0]);
		callback('Unauthorized');
    }
};

// Help function to generate an IAM policy
var generatePolicy = function(principalId, effect, resource) {
    var authResponse = {};
    
    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17'; 
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; 
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    
    // Optional output with custom properties of the String, Number or Boolean type.
    //authResponse.context = {
    //    "stringKey": "stringval",
    //    "numberKey": 123,
    //    "booleanKey": true
    //};
    return authResponse;
}