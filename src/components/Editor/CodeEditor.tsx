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
import CopyButton from '../Button/CopyButton';
import { Popover, Icon, Select } from 'antd';
import { ReactAPI } from '@/models/code';

interface ConfigEdtiorProps {
  dispatch: Dispatch,
  generatedCode: EditorState,
  reactAPISetting: ReactAPI,
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

  renderSettingButton() {
    const { reactAPISetting, dispatch } = this.props;

    const content = (
      <div>
        {/* React API */}
        <div className={styles.settingContent}>
          <div className={styles.settingContentLabel}>React API:</div>
          <Select
            size='small'
            value={reactAPISetting}
            onChange={(value) => {
              dispatch({
                type: 'save/updateReactAPI',
                payload: value,
              });
            }}>
            <Select.Option value={ReactAPI.Component}>Component-Based</Select.Option>
            <Select.Option value={ReactAPI.Hooks}>React hooks</Select.Option>
          </Select>
        </div>
      </div>
    );

    return (
      <Popover
        placement="bottomLeft"
        trigger="click"
        title="Code settings"
        content={content}
        arrowPointAtCenter
      >
        <Icon type="setting" className={styles.settingButton}/>
      </Popover>
    )
  }

  render() {
    const { generatedCode } = this.props;

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

          {/* copy content */}
          <CopyButton className={styles.copyButton} text={generatedCode.getCurrentContent().getPlainText()}/>

          {/* setting content */}
          {this.renderSettingButton()}
        </div>

        {/* editor */}
        {this.renderEditor()}
      </div>
    )
  }
}

export default connect(({ code, save }: ConnectState) => {
  return {
    generatedCode: code.generatedCode,
    reactAPISetting: save.ReactAPI,
  }
})(CodeEditor);
