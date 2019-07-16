import React from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect.d';
import styles from './Preview.less';

// import stylesheets for preview components.
import 'antd/es/date-picker/style';
import 'antd/es/divider/style';
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
        <div className={styles.container}>
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
