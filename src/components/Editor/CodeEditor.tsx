import React from 'react';
import styles from './CodeEditor.less';
import createCodeEditorPlugin from '@/utils/draft-js-code-editor-plugin';
import createPrismPlugin from '@/utils/draft-js-prism-plugin';
import { EditorState } from 'draft-js';
import { connect } from 'dva';
import { ConnectState } from '@/models/connect';
import Prism from 'prismjs';
import Editor from 'draft-js-plugins-editor';
import { Dispatch } from 'redux';

interface ConfigEdtiorProps {
  generatedCode: string,
  dispatch: Dispatch,
}

class CodeEditor extends React.Component<ConfigEdtiorProps> {
  constructor(props: ConfigEdtiorProps) {
    super(props);

    this.state = {
      plugins: [
        createPrismPlugin({
          prism: Prism
        }),
        createCodeEditorPlugin(),
      ],
    };
  }

  onChange = (editorState: EditorState) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'code/changeCodeEditorState',
      payload: editorState,
    });
  }

  renderEditor() {
    const { plugins }: any = this.state;
    const { generatedCode } = this.props;

    return (
      <div className={styles.editor}>
        <Editor
          editorState={generatedCode}
          plugins={plugins}
          onChange={this.onChange}
          readOnly={true}
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
          <div className={styles.title}>Generated code</div>
        </div>

        {/* editor */}
        {this.renderEditor()}
      </div>
    )
  }
}

export default connect(({ code }: ConnectState) => {
  return {
    generatedCode: code.generatedCode,
  }
})(CodeEditor);
