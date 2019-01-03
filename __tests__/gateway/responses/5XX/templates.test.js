import faker from 'faker';
import api from 'api-gateway-template-tester';

const validator = global.loadSchema('src/definitions/error.yml');

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'OPTIONS'];

const TYPES = ['DEFAULT_5XX', 'API_CONFIGURATION_ERROR', 'AUTHORIZER_FAILURE'];

const templatesPath = 'src/gateway/responses/5XX/responses.yml';

describe('5XX Gateway Response', () => {
  describe('Response', () => {
    describe('application/json', () => {
      const template = global.loadVelocityTemplate(templatesPath, 'application/json');

      const requestId = faker.random.uuid();

      const httpMethod = faker.random.arrayElement(METHODS);

      const responseType = faker.random.arrayElement(TYPES);

      const message = faker.random.words();

      const gateway = api().context({
        requestId,
        httpMethod,
        error: {
          responseType,
          message,
        },
      });

      it('renders without error', () => {
        expect(() => { gateway.render(template); }).not.toThrow();
      });

      it('is a valid Error schema', () => {
        const obj = JSON.parse(gateway.render(template));
        expect(validator(obj)).toBe(true);
      });

      it('renders a valid object', () => {
        const obj = JSON.parse(gateway.render(template));
        expect(obj).toEqual(expect.objectContaining({
          type: expect.stringMatching('InternalServerError'),
          message: expect.any(String),
          __raw: expect.objectContaining({
            requestId: expect.stringMatching(requestId),
            type: expect.stringMatching(httpMethod),
            gateway: expect.objectContaining({
              message: expect.stringMatching(message),
              type: expect.stringMatching(responseType),
            }),
          }),
        }));
      });
    });
  });
});
