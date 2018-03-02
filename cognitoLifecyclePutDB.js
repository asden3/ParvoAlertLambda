var AWS = require('aws-sdk');

var dynamodb = new AWS.DynamoDB();

//console.log("ddb");

exports.handler = function index(event, context, callback) {
    

//console.log(event.request.userAttributes.email);    

var params = {
    TableName:"Accounts",
    Item:{    
        "dateAndTime": {S: event.request.userAttributes.dateAndTime },
        "clinicName": {S: event.request.userAttributes.clinicName },
        "postcode": {S: event.request.userAttributes.postcode },
        "cityTown": {S: event.request.userAttributes.cityTown },
        "address": {S: event.request.userAttributes.address },
        "cognitoSubNumber": {S: event.request.userAttributes.cognitoSubNumber},
        "latAndLong": {S: event.request.userAttributes.latAndLong}
        }
    };



    
    dynamodb.putItem(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
})
}


