'use strict';

const Controller = require('egg').Controller;
const mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');
const child_process = require('child_process');

class FormController extends Controller {
  async analyze() {
    const { ctx, config } = this;
    const stream = await ctx.getFileStream();

    const mkdirpErr = await new Promise((resolve) => {
      mkdirp(config.paths.tempDir, (err) => {
        resolve(err);
      });
    });

    if (!mkdirpErr) {
      const randomKey = `${Math.random().toString(32).slice(6)}_${Date.now()}`;
      const targetFilePath = path.join(config.paths.tempDir, `${randomKey}.png`);
      const ws = fs.createWriteStream(targetFilePath);
      stream.pipe(ws);

      await new Promise(resolve => ws.on('close', () => resolve()));
      const extractRectError = await new Promise(resolve => child_process.exec(`node ${path.join(__dirname, '../scripts/extractRect.js')} ${targetFilePath}`, {}, error => {
        resolve(error);
      }));

      if (!extractRectError) {
        const rects = await new Promise(resolve => fs.readFile(targetFilePath.replace(path.extname(targetFilePath), '_bouding.json'), (err, data) => resolve(data)));

        child_process.exec(`rm ${path.join(config.paths.tempDir, randomKey)}*`);
        ctx.body = {
          code: 0,
          data: JSON.parse(rects.toString()) || [],
        };
      } else {
        ctx.body = {
          code: 0,
          data: [],
        }
      }
    }
  }
}

module.exports = FormController;