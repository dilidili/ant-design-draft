import React, { ReactElement, ReactComponentElement } from 'react';
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

type PreviewState = {
  hasError: boolean | Error;
}

class Preview extends React.Component<PreviewProps> {
  state = {
    hasError: false,
  }

  componentWillReceiveProps(nextProps: PreviewProps) {
    if (nextProps.previewCode !== this.props.previewCode) {
      this.setState({
        hasError: false,
      });
    }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: error };
  }

  render() {
    const { previewCode } = this.props;
    const { hasError } = this.state;

    let Component: any | null = null;

    if (hasError) {
      return null;
    }

    try {
      Component = eval(previewCode);
    } catch(err) {
      Component = null;
    }

    if (Component) {
      return (
        <div className={styles.container}>
          <Component />
        </div>
      );
    } else {
      return <div className={styles.container} />;
    }
  }
}

export default connect((state: ConnectState) => {
  return {
    previewCode: state.code.previewCode,
  }
})(Preview);
