import React from 'react';
import styles from './ConfigEditor.less';
import { Editor, EditorState } from 'draft-js';

class ConfigEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty()
    };
  }

  onChange = (editorState) => {
    this.setState({
      editorState,
    })
  }

  renderEditor() {
    return (
      <div className={styles.editor}>
      <Editor editorState={this.state.editorState} onChange={this.onChange} />
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

export default ConfigEditor;