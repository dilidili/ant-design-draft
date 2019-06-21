import React from 'react';
import styles from './ConfigEditor.less';
import createCodeEditorPlugin from '@/utils/draft-js-code-editor-plugin';
import createPrismPlugin from '@/utils/draft-js-prism-plugin';
import { EditorState } from 'draft-js';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState } from '@/models/connect';
import Prism from 'prismjs';
import Editor from 'draft-js-plugins-editor';

interface ConfigEdtiorProps {
  editorState: EditorState,
  dispatch: Dispatch,
}

class ConfigEditor extends React.Component<ConfigEdtiorProps> {
  constructor(props: ConfigEdtiorProps) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
      plugins: [
        createPrismPlugin({
          prism: Prism
        }),
        createCodeEditorPlugin()
      ],
    };
  }

  onChange = (editorState: EditorState) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'code/changeEditorState',
      payload: editorState,
    });
  }

  renderEditor() {
    const { plugins }: any = this.state;
    const { editorState } = this.props;

    return (
      <div className={styles.editor}>
        <Editor
          editorState={editorState}
          onChange={this.onChange}
          plugins={plugins}
        />
      </div>
    )
  }

  render() {
    return (
      <div className={styles.container}>
        {/* header */}
        <div className={styles.header}>
          <div className={styles.icons}>
            <span className={styles.close} />
            <span className={styles.minimize} />
            <span className={styles.fullScreen} />
          </div>
          <div className={styles.title}>Config</div>
        </div>

        {/* editor */}
        {this.renderEditor()}
      </div>
    )
  }
}

export default connect(({ code }: ConnectState) => {
  return {
    editorState: code.edtiorState,
  }
})(ConfigEditor);
