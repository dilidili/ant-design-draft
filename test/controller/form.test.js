const assert = require('assert');
const mock = require('egg-mock');
const path = require('path');

describe('test/controller/form.test.js', () => {
  let app;
  before(() => {
    app = mock.app();
    return app.ready();
  });

  it('should convert picture to form config', () => {
    return app.httpRequest()
      .post('/form/analyze')
      .attach('file', path.join(__dirname, '../resource/case_simple.png'))
      .expect(200)
      .then(response => {
        assert(response.body.code === 0);
        assert(Array.isArray(response.body.data));
      })
  });

  after(() => app.close());
});