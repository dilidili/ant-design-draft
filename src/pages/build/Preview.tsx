import React from 'react';
import { transform } from '@babel/standalone';

const code = transform(`
  class Test extends React.Component {
    render() {
      return <div>Test</div>
    }
  }
`, {
  presets: ['es2015', 'react'],
}).code;

class Preview extends React.Component {
  render() {
    return (
      <div>{code}</div>
    )
  }
}

export default Preview;
