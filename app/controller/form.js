'use strict';

const Controller = require('egg').Controller;
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');

class FormController extends Controller {
  async analyze() {
    const { ctx, config } = this;
    const stream = await ctx.getFileStream();
    console.log(stream)

    const mkdirpErr = await new Promise((resolve) => {
      mkdirp(config.paths.tempDir, (err) => {
        resolve(err);
      });
    });

    if (!mkdirpErr) {
      const targetFilePath = path.join(config.paths.tempDir, `${Math.random().toString(32).slice(6)}_${Date.now()}.png`);
      const ws = fs.createWriteStream(targetFilePath);
      stream.pipe(ws);

      await new Promise(resolve => ws.on('close', () => resolve()));
    }

    ctx.body = { code: 0 };
  }
}

module.exports = FormController;