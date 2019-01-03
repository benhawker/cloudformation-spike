import api from 'api-gateway-template-tester';

const validator = global.loadSchema('src/definitions/empty.yml');
const template = global.loadVelocityTemplate(
  'src/operations/postProduct/response.yml', 'application/json');

import * as dynamoResponse from './mock/mock-response.json';

describe('Validating response templates', () => {
  let test;
  let renderedResponse;
  let validationResponse;
  let validationErrors;

  beforeEach(() => {
    console.log(dynamoResponse);
    
    test = api().body(dynamoResponse);
    renderedResponse = test.render(template);
    
    console.log(renderedResponse);
    validationResponse = validator(JSON.parse(renderedResponse));
    
    console.log(renderedResponse);

    if (!validationResponse) {
      validationErrors = validator.errors;
    }
  });

  describe('Rendered correctly', () => {
    it('Produces valid JSON', () => {
      console.log(renderedResponse);
      expect(renderedResponse).toMatchSnapshot();
    });

    it('Validated correctly', () => {
      console.log(validationErrors);
      expect(validationResponse).toEqual(true);
    });
  });
});
