var AWS = require('aws-sdk');

exports.handler = function(event, context, callback) 
{
    var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();   
    var user =  event.cognitoSubNumber;
    var path =  event.queryPathParameters.thepath;
    var splitpath = path.split("/");
    var group = "";

    switch (splitpath[0]) 
    {
        case "admin":
            group = "admin"
            break; 
        case "researcher":
            group = "researcher"
            break;
        case "clinic":
            group = "clinic"
            break;
    }

    if (splitpath.length == 1)
    {
        var params = 
        {
            GroupName: group, /* required */
            UserPoolId: 'ap-southeast-2_FbqbUAeXA', /* required */
            //Limit: 0,
            //NextToken: 'STRING_VALUE'
        };

        cognitoidentityserviceprovider.listUsersInGroup(params, function(err, data) {
        if (err) 
        {
            console.log(err, err.stack); // an error occurred
            callback(err);
        }
        else     
        {
            console.log(data);           // successful response
            callback(null,data);
        }});
    }

    if (splitpath.length ==2)
    {
        var params = 
        {
            GroupName: group, 
            UserPoolId: 'ap-southeast-2_FbqbUAeXA', 
            Username: splitpath[1] 
        };

        if (event.httpmethod == "DELETE")
        {
            cognitoidentityserviceprovider.adminRemoveUserFromGroup(params, function(err, data) {
            if (err) 
            {
                console.log(err, err.stack); // an error occurred
                callback(err);
            }
            else     
            {
                console.log(data);           // successful response
                callback(null,data);
            }});
        }
        else if (event.httpmethod == "POST")
        {
            cognitoidentityserviceprovider.adminAddUserToGroup(params, function(err, data) {
            if (err) 
            {
                console.log(err, err.stack); // an error occurred
                callback(err);
            }
            else     
            {
                console.log(data);           // successful response
                callback(null,data);
            }});
        }
    }
    console.log(JSON.stringify(event));
}
