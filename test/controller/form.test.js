const assert = require('assert');
const mock = require('egg-mock');
const path = require('path');

describe('test/controller/form.test.js', () => {
  let app;
  before(() => {
    app = mock.app();
    return app.ready();
  });

  it('classify case_simple correctly', () => {
    return app.httpRequest()
      .post('/form/analyze')
      .attach('file', path.join(__dirname, '../resource/case_simple.png'))
      .expect(200)
      .then(response => {
        assert(response.body.code === 0);
        const types = response.body.data.contours.map(v => v.type);
        const modes = response.body.data.contours.map(v => v.mode);

        assert(types.join(',') === [4, 1, 4, 2, 3, 3].join(','));
        assert(modes.join(',') === [0, 0, 0, 0, 0, 0].join(','));
      })
  });

  it('classify case_registration correctly', () => {
    return app.httpRequest()
      .post('/form/analyze')
      .attach('file', path.join(__dirname, '../resource/case_registration.png'))
      .expect(200)
      .then(response => {
        assert(response.body.code === 0);
        const types = response.body.data.contours.map(v => v.type);
        const modes = response.body.data.contours.map(v => v.mode);

        assert(types.join(',') === [1, 2, 4, 3, 3, 3, 3, 3, 3, 3, 3].join(','));
        assert(modes.join(',') === [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1].join(','));
      })
  });

  after(() => app.close());
});