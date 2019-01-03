import api from 'api-gateway-template-tester';
import * as helpers from '../../__utils__/testHelpers.js';
import { requestBody } from './mock/mockClientRequest.js';
import { product } from './mock/dynamoProduct.js';

// Load the request template that we are testing.
// I.e. template that we use to build POST request to DynamoDB.
const template = global.loadVelocityTemplate(
  'src/operations/postProduct/request.yml', 'application/json');

xdescribe('Validating request templates', () => {
  let test;
  let interpolatedTemplate;
  let parsedTemplate;

  beforeAll((done) => {
    // helpers.ddb.createTable(helpers.tableParams, done);
    test = api().stageVariables({ ProductsTable: helpers.tableName }).body(requestBody);
    interpolatedTemplate = test.render(template);
    parsedTemplate = JSON.parse(interpolatedTemplate);
  });

  // afterAll((done) => {
  //   helpers.ddb.deleteTable({ TableName: helpers.tableName }, done);
  // });

  describe('returns the correct response', () => {
    it('succesffully adds the item and returns the expected response', (done) => {
      helpers.ddb.putItem(parsedTemplate, (err, data) => {
        // This snapshot is incorrect. 
        // Expectation is for: http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/API_PutItem_v20111205.html#API_PutItem_CommonResponseElements
        expect(data).toMatchSnapshot(); 

        helpers.ddb.scan({ "TableName": `${helpers.tableName}` }, (err, data) => {
          expect(data).toMatchSnapshot();
        });

        done();
      });
    });

    it('interpolates and parses the template correctly', () => {
      const expectedTemplate = ({
        TableName: helpers.tableName,
        Item: product,
      });

      expect(JSON.parse(interpolatedTemplate)).toEqual(expectedTemplate);
    });
  });
});
