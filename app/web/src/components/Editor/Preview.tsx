import React, { ReactElement, ReactComponentElement, MouseEventHandler } from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect.d';
import { Tooltip, Icon, Upload, Spin } from 'antd';
import { UploadFile, UploadChangeParam } from 'antd/lib/upload/interface'
import styles from './Preview.less';

// import stylesheets for preview components.
import 'antd/es/date-picker/style';
import 'antd/es/divider/style';
(window as any).React = React;
(window as any).AntD = require('antd');

const stopPropagationListener: MouseEventHandler = (evt) => evt.stopPropagation;

type PreviewProps = {
  previewCode: string,
  editLayoutFile: UploadFile | null,
  dispatch: Function,
}

type PreviewState = {
  hasError: boolean;
}

class Preview extends React.Component<PreviewProps, PreviewState> {
  state: PreviewState = {
    hasError: false,
  }

  componentDidMount() {
    const { dispatch } = this.props;
    (window as any).highLightLines = (payload: string) => {
      try {
        dispatch({
          type: 'code/updateHighlightLines',
          payload: JSON.parse(payload),
        });
      } catch(err) {}
    }
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

  renderPreviewContent() {
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
        <div className={styles.previewContent}>
          <Component />
        </div>
      );
    } else {
      return null;
    }
  }

  renderHeader() {
    const uploadProps = {
      name: 'file',
      action: '/form/analyze',
      accept: 'image/png',
      multiple: false,
      onChange: (info: UploadChangeParam<UploadFile>) => {
        this.props.dispatch({
          type: 'preview/updateEditLayoutFile',
          payload: {
            file: info.file,
          },
        })
      },
      showUploadList: false,
    }

    return (
      <div className={styles.header} onClick={stopPropagationListener}>
        <Tooltip title="build by image">
          <Upload className={styles.uploadButton} {...uploadProps}>
            <Icon type="file-image" />
          </Upload>
        </Tooltip>
      </div>
    )
  }

  render() {
    const { editLayoutFile } = this.props;

    let spinning = false
    if (editLayoutFile !== null) {
      spinning = editLayoutFile.status === 'uploading';
    }

    return (
      <Spin tip="Uploading..." spinning={spinning}>
        <div className={styles.container}>
          {this.renderHeader()}
          {this.renderPreviewContent()}
        </div>
      </Spin>
    ) 
  }
}

export default connect((state: ConnectState) => {
  return {
    previewCode: state.code.previewCode,
    editLayoutFile: state.preview.editLayoutFile,
  }
})(Preview);
