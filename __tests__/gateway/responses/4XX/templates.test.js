import faker from 'faker';
import api from 'api-gateway-template-tester';

const validator = global.loadSchema('src/definitions/error.yml');

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'HEAD', 'OPTIONS'];

const TYPES = ['DEFAULT_4XX', 'BAD_REQUEST_PARAMETERS', 'BAD_REQUEST_BODY'];

const templatesPath = 'src/gateway/responses/4XX/responses.yml';

describe('4XX Gateway Response', () => {
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
          type: expect.stringMatching('BadRequest'),
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
