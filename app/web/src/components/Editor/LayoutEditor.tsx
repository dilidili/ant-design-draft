import React from 'react';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect.d';

interface LayoutEditorProps {
};

class LayoutEditor extends React.Component<LayoutEditorProps> {
  getDerivedStateFromProps() {

  }

  render() {
    console.log(this.props.formLayout);
    return <div></div>;
  }
}

export default connect((state: ConnectState) => {
  return {
    formLayout: state.preview.formLayout,
  }
})(LayoutEditor);