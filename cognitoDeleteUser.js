exports.handler = function(event, context) 
{
    var params = 
    {
        AccessToken: 'STRING_VALUE' /* required */
    };

    cognitoidentityserviceprovider.deleteUser(params, function(err, data) {
    if (err) 
    {
        console.log(err, err.stack); // an error occurred
        callback(err);
    }
    else
    {
            console.log(data);           // successful response
            callback(null, data);
    }
    });
};


