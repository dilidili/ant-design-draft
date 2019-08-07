'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/form/analyze', controller.form.analyze);
  router.get('*', controller.home.index);
};