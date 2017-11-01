const AWS = require('aws-sdk');

const REGION = process.env.AWS_REGION;
const TABLE = process.env.TABLE;

const documentClient = () => {
  const params = { TableName: TABLE };
  return new AWS.DynamoDB.DocumentClient({ region: REGION, params });
}

exports.writeToDB = (event, context, cb) => {
  const Item = {
    id: 999,
    name: 'Test',
    price: 99
  };
  
  documentClient().put({ TableName: TABLE, Item }, (err) => {
    if (err) {
      cb(err);
    } else {
      cb(null, Item);
    }
  });
}