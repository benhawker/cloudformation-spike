const AWS = require('aws-sdk');

const REGION = process.env.AWS_REGION;
const TABLE = process.env.TABLE;

const documentClient = () => {
  const params = { TableName: TABLE };
  return new AWS.DynamoDB.DocumentClient({ region: REGION, params });
}

exports.writeToDB = (event, context, cb) => {
  const id = Math.floor(Math.random()*100000);
  const price = Math.floor(Math.random()*100);
  const Item = {
    id:  `${id}`,
    name: `Product Name ${id}`,
    price: price
  };
  
  documentClient().put({ TableName: TABLE, Item }, (err) => {
    if (err) {
      cb(err);
    } else {
      cb(null, Item);
    }
  });
};