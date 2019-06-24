import React from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect.d';

type PreviewProps = {
  previewCode: string,
}

class Preview extends React.Component<PreviewProps> {
  render() {
    const { previewCode } = this.props;

    return (
      <div>{previewCode}</div>
    )
  }
}

export default connect((state: ConnectState) => {
  return {
    previewCode: state.code.previewCode,
  }
})(Preview);
