// Create the IAM service object
var iam = new AWS.IAM({apiVersion: '2010-05-08'});

var Authorization = "";
var userPrincipalId;
var myManagedPolicy;
var myAPIPolicy;


//"Resource": "arn:aws:execute-api:ap-southeast-2:431503666859:4v6ubg8ms8/{stage}/{httpVerb}/[{resource}/[child-resources]]"

var adminManagedPolicy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "execute-api:Invoke",
            "Resource": "arn:aws:execute-api:ap-southeast-2:431503666859:4v6ubg8ms8/{stage}/{httpVerb}/[{resource}/[child-resources]]"
        },
        {
            "Effect": "Deny",
            "Action": "apigateway:*",
            "Resource": "arn:aws:apigateway:ap-southeast-2::/*/"
        }
    ]
};

var researcherManagedPolicy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "apigateway:*",
            "Resource": "arn:aws:apigateway:ap-southeast-2::/*/"
        },
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:DeleteItem",
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:Scan",
                "dynamodb:UpdateItem"
            ],
            "Resource": "RESOURCE_ARN"
        }
    ]
};
var clinicManagedPolicy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "apigateway:*",
            "Resource": "arn:aws:apigateway:ap-southeast-2::/*/"
        },
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:DeleteItem",
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:Scan",
                "dynamodb:UpdateItem"
            ],
            "Resource": "RESOURCE_ARN"
        }
    ]
};
var nonclinicManagedPolicy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "apigateway:*",
            "Resource": "arn:aws:apigateway:ap-southeast-2::/*/"
        },
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:DeleteItem",
                "dynamodb:GetItem",
                "dynamodb:PutItem",
                "dynamodb:Scan",
                "dynamodb:UpdateItem"
            ],
            "Resource": "RESOURCE_ARN"
        }
    ]
};

//Search the groups for membership in decending order, apply the first match else non-clinic

if (userGroups.indexOf("admin") > -1) 
{
    myManagedPolicy = adminManagedPolicy;
    myAPIPolicy = "admin API Policy"
}
else if (userGroups.indexOf("researcher") > -1)
{
    myManagedPolicy = researcherManagedPolicy;
    myAPIPolicy = "researcher API Policy"
}
else if (userGroups.indexOf("clinic") > -1)
{
    myManagedPolicy = clinicManagedPolicy;
    myAPIPolicy = "clinic API Policy"
}
else 
{
    myManagedPolicy = nonclinicManagedPolicy;
    myAPIPolicy = "non-clinic API Policy"
}


var params = {
  PolicyDocument: JSON.stringify(myManagedPolicy),
  PolicyName: myAPIPolicy,
  principalId: userPrincipalId,
};

iam.createPolicy(params, function(err, data) {
  if (err) {
    throw err;
  } else {
    console.log("New Policy: ", data);
  }
});