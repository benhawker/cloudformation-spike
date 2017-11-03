const AWS = require('aws-sdk');

const REGION = process.env.AWS_REGION;
const TABLE = process.env.TABLE;

const documentClient = () => {
  const params = { TableName: TABLE };
  return new AWS.DynamoDB.DocumentClient({ region: REGION, params });
}

exports.handler = (event, context, cb) => {
  if (!event || !event.Records || event.Records.length < 1) {
    cb('malformed event ', event);
    return;
  }

  const record = event.Records.shift();
  let { Subject, Message } = record.Sns;
 
  try {
    Message = JSON.parse(Message);
  } catch (e) {
    cb(e);
    return;
  }

  const id = Message.id || '0';
  const price = Message.price || 0;

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


/// "Message": "{\"id\": \"37738\",\"name\": \"Product Name 37738\",\"price\": 59}",