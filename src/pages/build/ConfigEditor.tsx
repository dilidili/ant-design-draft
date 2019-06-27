import React from 'react';
import styles from './ConfigEditor.less';
import createCodeEditorPlugin from '@/utils/draft-js-code-editor-plugin';
import createPrismPlugin from '@/utils/draft-js-prism-plugin';
import createUndoPlugin from 'draft-js-undo-plugin';
import createMentionPlugin, { defaultSuggestionsFilter } from 'ant-design-draft-mention-plugin';
import 'ant-design-draft-mention-plugin/lib/plugin.css';
import { EditorState } from 'draft-js';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState } from '@/models/connect';
import Prism from 'prismjs';
import Editor from 'draft-js-plugins-editor';
import { Tooltip, Icon } from 'antd';
import mentions, { Mention } from './mentions';

interface ConfigEdtiorProps {
  editorState: EditorState,
  saveConfigCode: string,
  dispatch: Dispatch,
}

const MentionEntry = (props: { mention: Mention, theme: any }) => {
  const {
    mention,
    theme,
    ...parentProps
  } = props;

  return (
    <div {...parentProps}>
      <div className={theme.mentionSuggestionsEntryContainer}>
        <div className={theme.mentionSuggestionsEntryContainerRight}>
          <div style={{ color: '#0076ff', fontWeight: 700, fontSize: '14px' }}>
            {mention.shortname}
          </div>

          <div style={{ fontWeight: 400, fontSize: '12px', lineHeight: '24px' }}>
            {mention.title}
          </div>
        </div>
      </div>
    </div>
  );
}

class ConfigEditor extends React.Component<ConfigEdtiorProps> {
  mentionPlugin: any;

  constructor(props: ConfigEdtiorProps) {
    super(props);

    this.mentionPlugin = createMentionPlugin({
      mentions,
      entityMutability: 'MUTABLE',
    });
    this.state = {
      plugins: [
        this.mentionPlugin,
        createPrismPlugin({
          prism: Prism
        }),
        createCodeEditorPlugin(),
        createUndoPlugin(),
      ],
      suggestions: [],
    };
  }

  componentDidMount() {
    const { saveConfigCode, dispatch } = this.props;
    if (saveConfigCode) {
      dispatch({
        type: 'code/loadConfigCode',
        payload: saveConfigCode,
      });
    }
  }

  onChange = (editorState: EditorState) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'code/changeEditorState',
      payload: editorState,
    });
  }

  onMentionSearchChange = ({ value }: { value: string }) => {
    this.setState({
      suggestions: defaultSuggestionsFilter(value, mentions),
    })
  }

  handleResetContent = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'code/resetConfigEditor',
    });
  }

  renderEditor() {
    const { plugins, suggestions }: any = this.state;
    const { editorState } = this.props;
    const { MentionSuggestions } = this.mentionPlugin;

    return (
      <div className={styles.editor}>
        <Editor
          editorState={editorState}
          onChange={this.onChange}
          plugins={plugins}
        />
        <MentionSuggestions
          onSearchChange={this.onMentionSearchChange}
          suggestions={suggestions}
          entryComponent={MentionEntry}
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

          {/* reset content */}
          <Tooltip title="reset">
            <Icon type="rollback" className={styles.resetButton} onClick={this.handleResetContent}/>
          </Tooltip>
        </div>

        {/* editor */}
        {this.renderEditor()}
      </div>
    )
  }
}

export default connect(({ code, save }: ConnectState) => {
  return {
    editorState: code.edtiorState,
    saveConfigCode: save.configCode,
  }
})(ConfigEditor);
