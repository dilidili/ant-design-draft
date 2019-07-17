import React, { MouseEventHandler } from 'react';
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
import { Popover, Icon, Select, Switch } from 'antd';
import { ReactAPI } from '@/models/code';

const getTriggerContainer = (triggerNode: HTMLElement) => triggerNode;

interface ConfigEdtiorProps {
  dispatch: Dispatch,
  generatedCode: EditorState,
  reactAPISetting: ReactAPI,
  useTypescript: boolean,
  onFocus?: MouseEventHandler,
}

interface ConfigEdtiorState {
  settingVisible: boolean,
  plugins: Array<any>,
}

class CodeEditor extends React.Component<ConfigEdtiorProps, ConfigEdtiorState> {
  constructor(props: ConfigEdtiorProps) {
    super(props);

    this.state = {
      plugins: [
        createPrismPlugin({
          prism: Prism
        }),
        createCodeEditorPlugin(),
      ],

      settingVisible: false,
    };
  }

  onChange = (editorState: EditorState) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'code/changeCodeEditorState',
      payload: editorState,
    });
  }

  handleChangeReactAPI = (value: string) => {
    this.setState({
      settingVisible: false,
    });

    this.props.dispatch({
      type: 'save/updateReactAPI',
      payload: value,
    });
  }

  handleChangeUseTypescript = (checked: boolean) => {
    this.props.dispatch({
      type: 'save/updateUseTypescript',
      payload: checked,
    })
  }

  handleClickHeader: MouseEventHandler = (evt) => {
    evt.stopPropagation()
  }

  handleChangeSettingVisible = (visible: boolean) => {
    this.setState({
      settingVisible: visible,
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
        />
      </div>
    )
  }

  renderSettingButton() {
    const { reactAPISetting, dispatch, useTypescript } = this.props;
    const { settingVisible } = this.state;

    const content = (
      <div>
        {/* React API */}
        <div className={styles.settingContent}>
          <div className={styles.settingContentLabel}>React API:</div>
          <Select
            size='small'
            value={reactAPISetting}
            getPopupContainer={getTriggerContainer}
            onChange={this.handleChangeReactAPI}
          >
            <Select.Option value={ReactAPI.Component}>Component-Based</Select.Option>
            <Select.Option value={ReactAPI.Hooks}>React hooks</Select.Option>
          </Select>
        </div>

        {/* Typescript */}
        <div className={styles.settingContent}>
          <div className={styles.settingContentLabel}>Typescript:</div>
          <Switch
            checkedChildren={<Icon type="check" />}
            unCheckedChildren={<Icon type="close" />}
            checked={useTypescript}
            onChange={this.handleChangeUseTypescript}
          />
        </div>
      </div>
    );

    return (
      <Popover
        placement="bottomLeft"
        trigger="click"
        title="Code settings"
        visible={settingVisible}
        content={content}
        arrowPointAtCenter={true}
        getPopupContainer={getTriggerContainer}
        onVisibleChange={this.handleChangeSettingVisible}
      >
        <Icon  type="setting" className={styles.settingButton} />
      </Popover>
    )
  }

  render() {
    const { generatedCode } = this.props;
    const { onFocus } = this.props;

    return (
      <div className={styles.container} onClick={onFocus}>
        {/* header */}
        <div className={styles.header} onClick={this.handleClickHeader}>
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
    useTypescript: save.useTypescript,
  }
})(CodeEditor);
