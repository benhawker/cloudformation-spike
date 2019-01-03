// Define a name for the table we will create for testing in localstack DynamoDB.
const tableName = 'ProductsTableTest';

function isValidJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function createProduct(id) {
  return ({
    TableName: tableName,
    Item: {
      description: { S: 'Another really great product description' },
      title: { S: `Product Name ${id}` },
      price: { N: '100' },
      id: { S: `${id}` },
    },
  });
}

const tableParams = {
  AttributeDefinitions: [
    {
      AttributeName: 'id',
      AttributeType: 'S',
    },
  ],
  KeySchema: [
    {
      AttributeName: 'id',
      KeyType: 'HASH',
    },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  TableName: tableName,
};

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');

// We must set the path to localstack dynamo served on regular http.
AWS.config.update({
  region: 'local',
  endpoint: 'localhost:4569',
  sslEnabled: false }
);

// Create DynamoDB service object
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

export { isValidJson,
         createProduct,
         tableName,
         ddb,
         tableParams,
       };

