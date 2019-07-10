import { IConfig } from 'umi-types';

// ref: https://umijs.org/config/
const config: IConfig =  {
  hash: true,
  publicPath: '',
  outputPath: '../public',
  manifest: {
    fileName: '../../config/manifest.json',
  },
}

export default config;
