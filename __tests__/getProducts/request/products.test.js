import api from 'api-gateway-template-tester';
import * as helpers from '../../__utils__/testHelpers.js';

// Load the request template that we are testing.
// I.e. template that we use to build POST request to DynamoDB.
const template = global.loadVelocityTemplate(
  'src/operations/getProducts/request.yml', 'application/json');


describe('Validating request templates', () => {
  let test;
  let interpolatedTemplate;
  let parsedTemplate;

  const itemsArray = [helpers.createProduct(1), helpers.createProduct(2), helpers.createProduct(3)];

  beforeAll((done) => {
    helpers.ddb.createTable(helpers.tableParams, () => {
      helpers.ddb.putItem(itemsArray[0], () => {
        helpers.ddb.putItem(itemsArray[1], () => {
          helpers.ddb.putItem(itemsArray[2], done);
        });
      });
    });

    test = api().stageVariables({ ProductsTable: helpers.tableName });
    interpolatedTemplate = test.render(template);
    parsedTemplate = JSON.parse(interpolatedTemplate);
  });

  afterAll((done) => {
    helpers.ddb.deleteTable({ TableName: helpers.tableName }, done);
  });

  describe('returns the correct response', () => {
    it('Produced valid JSON', (done) => {
      helpers.ddb.scan(parsedTemplate, (err, data) => {
        expect(data).toMatchSnapshot();
        done();
      });
    });

    it('interpolates and parses the template correctly', () => {
      const expectedTemplate = { TableName: helpers.tableName };
      expect(JSON.parse(interpolatedTemplate)).toEqual(expectedTemplate);
    });

    it('is valid JSON', () => {
      expect(helpers.isValidJson(template)).toEqual(true);
    });
  });
});
