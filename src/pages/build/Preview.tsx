import React from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect.d';

(window as any).React = React;
(window as any).AntD = require('antd');

type PreviewProps = {
  previewCode: string,
}

class Preview extends React.Component<PreviewProps> {
  render() {
    const { previewCode } = this.props;
    const Component = eval(previewCode);

    if (Component) {
      return (
        <div>
          <Component />
        </div>
      );
    } else {
      return null;
    }
  }
}

export default connect((state: ConnectState) => {
  return {
    previewCode: state.code.previewCode,
  }
})(Preview);
