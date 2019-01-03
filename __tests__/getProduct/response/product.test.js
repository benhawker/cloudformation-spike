import api from 'api-gateway-template-tester';

const validator = global.loadSchema('src/definitions/product.yml');
const template = global.loadVelocityTemplate(
  'src/operations/getProduct/response.yml', 'application/json');
import * as dynamoResponse from './mock/mock-response.json';

describe('Validating response templates', () => {
  let test;
  let renderedResponse;
  let validationResponse;
  let validationErrors;

  beforeEach(() => {
    test = api().body(dynamoResponse);
    renderedResponse = test.render(template);
    validationResponse = validator(JSON.parse(renderedResponse));

    if (!validationResponse) {
      validationErrors = validator.errors;
    }
  });

  describe('Rendered correctly', () => {
    it('Produced valid JSON', () => {
      expect(renderedResponse).toMatchSnapshot();
    });

    it('Validated correctly', () => {
      expect(validationResponse).toEqual(true);
    });

    it('Had no errors', () => {
      expect(validationErrors).not.toBeDefined();
    });
  });
});
