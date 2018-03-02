// A simple TOKEN authorizer example to demonstrate how to use an authorization token 
// to allow or deny a request. In this example, the caller named 'user' is allowed to invoke 
// a request if the client-supplied token value is 'allow'. The caller is not allowed to invoke 
// the request if the token value is 'deny'. If the token value is 'Unauthorized', the function 
// returns the 'Unauthorized' error with an HTTP status code of 401. For any other token value, 
// the authorizer returns an 'Invalid token' error. 

exports.handler =  function(event, context, callback) {
    var wholeToken = event.authorizationToken.split(' ');
    var authResponse = {};
    if(wholeToken[0] === 'Bearer')
    {
        var jwtToken = wholeToken[1]
        //console.log(jwtToken[1]);
        var splitJWTToken = jwtToken.split(".");
        //console.log(splitJWTToken[1]);
        var claims = new Buffer(splitJWTToken[1], 'base64').toString('ascii')
        //console.log(claims);
        var claimsobj = JSON.parse(claims);
        //console.log(claimsobj);
        //console.log(claimsobj['cognito:groups']);
        var userGroups = claimsobj['cognito:groups'];
        //console.log(userGroups);
        var userSub = claimsobj.sub;
        //console.log(userSub);

        if (userGroups.indexOf("admin") > -1) 
        {
            authResponse.principalId = `User ${userSub} is in group = admin`;
            authResponse.policyDocument = adminManagedPolicy
            authResponse.context = 
            {
                "cognitoSubNumber" : userSub,
                "identifiedGroup" : "admin"
            }
            callback(null, authResponse);
        }
        else if (userGroups.indexOf("researcher") > -1) 
        {
            authResponse.principalId = `User ${userSub} is in group = researcher`;
            authResponse.policyDocument = researcherManagedPolicy
            authResponse.context = 
            {
                "cognitoSubNumber" : userSub,
                "identifiedGroup" : "researcher"
            }
            callback(null, authResponse);
        }
        else if (userGroups.indexOf("clinic") > -1) 
        {
            authResponse.principalId = `User ${userSub} is in group = clinic`;
            authResponse.policyDocument = clinicManagedPolicy
            authResponse.context = 
            {
                "cognitoSubNumber" : userSub,
                "identifiedGroup" : "clinic"
            }
            callback(null, authResponse);
        }
        else 
        {
            authResponse.principalId = `User ${userSub} is in group = non-clinic`;
            authResponse.policyDocument = nonclinicManagedPolicy
            authResponse.context = 
            {
                "cognitoSubNumber" : userSub,
                "identifiedGroup" : "non-clinic"
            }
            callback(null, authResponse);
        }
    } 
    else 
    {
		// Require a "Bearer" token
		console.log('Wrong token type', token[0]);
		callback('Unauthorized, token needs to be of the Bearer type');
    }
};


//"Resource": "arn:aws:execute-api:ap-southeast-2:431503666859:4v6ubg8ms8/{stage}/{httpVerb}/[{resource}/[child-resources]]"

var adminManagedPolicy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "execute-api:Invoke",
            "Resource": "arn:aws:execute-api:ap-southeast-2:431503666859:4v6ubg8ms8/*/*/*"
        }
    ]
};

//"Resource": "arn:aws:execute-api:ap-southeast-2:431503666859:4v6ubg8ms8/{stage}/{httpVerb}/[{resource}/[child-resources]]"

var researcherManagedPolicy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "execute-api:Invoke",
            "Resource": "arn:aws:execute-api:ap-southeast-2:431503666859:4v6ubg8ms8/GET/*/cases/*"
        },
        {
            "Effect": "Allow",
            "Action": "execute-api:Invoke",
            "Resource": "arn:aws:execute-api:ap-southeast-2:431503666859:4v6ubg8ms8/OPTIONS/*/cases/*"
        },
        {
            "Effect": "Allow",
            "Action": "execute-api:Invoke",
            "Resource": "arn:aws:execute-api:ap-southeast-2:431503666859:4v6ubg8ms8/*/*/profile/*"
        },
        {
            "Effect": "Deny",
            "Action": "apigateway:Invoke",
            "Resource": "arn:aws:execute-api:ap-southeast-2:431503666859:4v6ubg8ms8/*/*/admin/*"
        },
        {
            "Effect": "Deny",
            "Action": "apigateway:Invoke",
            "Resource": "arn:aws:execute-api:ap-southeast-2:431503666859:4v6ubg8ms8/DELETE/*/cases/*"
        },
        {
            "Effect": "Deny",
            "Action": "apigateway:Invoke",
            "Resource": "arn:aws:execute-api:ap-southeast-2:431503666859:4v6ubg8ms8/POST/*/cases/*"
        }
    ]
};

//"Resource": "arn:aws:execute-api:ap-southeast-2:431503666859:4v6ubg8ms8/{stage}/{httpVerb}/[{resource}/[child-resources]]"

var clinicManagedPolicy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "execute-api:Invoke",
            "Resource": "arn:aws:execute-api:ap-southeast-2:431503666859:4v6ubg8ms8/*/*/cases/*"
        },
        {
            "Effect": "Allow",
            "Action": "execute-api:Invoke",
            "Resource": "arn:aws:execute-api:ap-southeast-2:431503666859:4v6ubg8ms8/*/*/profile/*"
        },
        {
            "Effect": "Deny",
            "Action": "apigateway:Invoke",
            "Resource": "arn:aws:execute-api:ap-southeast-2:431503666859:4v6ubg8ms8/*/*/admin/*"
        }
    ]
};

//"Resource": "arn:aws:execute-api:ap-southeast-2:431503666859:4v6ubg8ms8/{stage}/{httpVerb}/[{resource}/[child-resources]]"

var nonclinicManagedPolicy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "execute-api:Invoke",
            "Resource": "arn:aws:execute-api:ap-southeast-2:431503666859:4v6ubg8ms8/*/*/profile/*"
        },
        {
            "Effect": "Deny",
            "Action": "apigateway:Invoke",
            "Resource": "arn:aws:execute-api:ap-southeast-2:431503666859:4v6ubg8ms8/*/*/admin/*"
        },
        {
            "Effect": "Deny",
            "Action": "apigateway:Invoke",
            "Resource": "arn:aws:execute-api:ap-southeast-2:431503666859:4v6ubg8ms8/*/*/cases/*"
        }
    ]
};