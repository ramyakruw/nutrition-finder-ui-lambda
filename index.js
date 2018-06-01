const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({
    apiVersion: '2012-08-10'
});

var dateObj = new Date();
var queryKey = dateObj.getUTCFullYear().toString() + dateObj.getUTCMonth().toString();

var params = {
    ExpressionAttributeValues: {
        ":v1": {
            N: queryKey
        }
    },
    KeyConditionExpression: "QueryKey = :v1",
    TableName: "nutrition-finder-db",
    ScanIndexForward: false
};

exports.handler = (event, context, callback) => {
    getFoodHistory(function(err, items) {
        if (err != null) {
            return handleError(err, callback);
        }

        createResponse(items, callback);
    })
};

function createResponse(items, callback) {
    let response = {
        statusCode: 200,
        body: JSON.stringify(items),
        headers: {
                'Access-Control-Allow-Origin': '*',
        },
    };
    callback(null, response);
}

function handleError(error, callback) {
    console.log(error);
    let response = {
        statusCode: 500,
        body: error.toString(),
        headers: {
                'Access-Control-Allow-Origin': '*',
        },
    };

    callback(null, response);
}

function getFoodHistory(callback) {

    dynamodb.query(params, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            return callback(err, null);
        }

        console.log(data);
        callback(null, data.Items);
    });
}
