import api from 'api-gateway-template-tester';
import * as helpers from '../../__utils__/testHelpers.js';

// Load the request template that we are testing.
// I.e. template that we use to build POST request to DynamoDB.
const template = global.loadVelocityTemplate(
  'src/operations/getProduct/request.yml', 'application/json');

describe('Validating request templates', () => {
  const id = 1;
  let test;
  let interpolatedTemplate;
  let parsedTemplate;

  beforeAll((done) => {
    helpers.ddb.createTable(helpers.tableParams, () => {
      helpers.ddb.putItem(helpers.createProduct(id), done);
    });

    test = api().stageVariables({ ProductsTable: helpers.tableName }).queryStrings({ id: `${id}` });
    interpolatedTemplate = test.render(template);
    parsedTemplate = JSON.parse(interpolatedTemplate);
  });

  afterAll((done) => {
    helpers.ddb.deleteTable({ TableName: helpers.tableName }, done);
  });

  describe('returns the correct response', () => {
    it('Produced valid JSON', (done) => {
      helpers.ddb.getItem(parsedTemplate, (err, data) => {
        expect(data).toMatchSnapshot();
        done();
      });
    });

    it('interpolates and parses the template correctly', () => {
      const expectedTemplate = ({
        TableName: helpers.tableName,
        Key: {
          id: { S: '1' },
        },
      });
      expect(JSON.parse(interpolatedTemplate)).toEqual(expectedTemplate);
    });

    it('is valid JSON', () => {
      expect(helpers.isValidJson(template)).toEqual(true);
    });
  });
});
