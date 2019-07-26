import React, { MouseEventHandler } from 'react';
import styles from './ConfigEditor.less';
import createCodeEditorPlugin from '@/utils/draft-js-code-editor-plugin';
import createPrismPlugin from '@/utils/draft-js-prism-plugin';
import createUndoPlugin from 'draft-js-undo-plugin';
import createMentionPlugin from 'ant-design-draft-mention-plugin';
import { EditorState } from 'draft-js';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState } from '@/models/connect';
import { HighlightLinesType } from '@/models/code';
import Prism from 'prismjs';
import Editor from 'draft-js-plugins-editor';
import { Tooltip, Icon, Drawer } from 'antd';
import mentions, { Mention } from './mentions';
import HelpCenter from './HelpCenter';

interface ConfigEdtiorProps {
  editorState: EditorState,
  highlightLines: HighlightLinesType,
  saveConfigCode: string,
  dispatch: Dispatch,
  onFocus?: MouseEventHandler,
}

interface ConfigEdtiorState {
  helpDrawerVisible: boolean,
  plugins: any,
  suggestions: any,
}

const stopPropagationListener: MouseEventHandler = (evt) => evt.stopPropagation;

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

const suggestionsFilter = (searchValue: string, suggestions: any) => {
  var value = searchValue.toLowerCase();
  var filteredSuggestions = suggestions.filter(function (suggestion: any) {
    return !value || suggestion.shortname.toLowerCase().indexOf(value) > -1;
  });
  var length = filteredSuggestions.length < 5 ? filteredSuggestions.length : 5;
  return filteredSuggestions.slice(0, length);
}; 

class ConfigEditor extends React.Component<ConfigEdtiorProps, ConfigEdtiorState> {
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
      helpDrawerVisible: false,
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

  showHelpDrawer: MouseEventHandler = () => {
    this.setState({
      helpDrawerVisible: true,
    });
  }

  onHelpDrawerClose = () => {
    this.setState({
      helpDrawerVisible: false,
    });
  }

  onMentionSearchChange = ({ value }: { value: string }) => {
    this.setState({
      suggestions: suggestionsFilter(value, mentions),
    })
  }

  handleResetContent: MouseEventHandler = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'code/resetConfigEditor',
    });
  }

  handleFormatContent: MouseEventHandler = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'code/prettifyConfigEditor',
    });
  }

  renderHighlightLines() {
    const { highlightLines } = this.props;

    if (!highlightLines) return null;

    const {
      start: {
        line: startLine,
      },
      end: {
        line: endLine,
      }
    } = highlightLines;

    return (
      <div style={{ position: 'absolute', top: 10 + (startLine - 1) * 21, height: (endLine - startLine + 1) * 21, left: 10, right: 10, background: 'rgba(69, 142, 225, 0.1)' }} />
    )
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
        {this.renderHighlightLines()}
      </div>
    )
  }

  renderHelpDrawer() {
    const { helpDrawerVisible } = this.state;

    return (
      <Drawer
        title="Helper"
        placement="right"
        closable={false}
        width={512}
        onClose={this.onHelpDrawerClose}
        visible={helpDrawerVisible}
      >
        <HelpCenter />
      </Drawer>
    )
  }

  render() {
    const { onFocus } = this.props;

    return (
      <div className={styles.container} onClick={onFocus}>
        {/* header */}
        <div className={styles.header} onClick={stopPropagationListener}>
          <div className={styles.icons}>
            <span className={styles.close} />
            <span className={styles.minimize} />
            <span className={styles.fullScreen} />
          </div>
          <div className={styles.title}>Config</div>

          <Tooltip title="reset">
            <Icon type="rollback" className={styles.resetButton} onClick={this.handleResetContent} />
          </Tooltip>

          <Tooltip title="format">
            <Icon type="menu-unfold" className={styles.formatButton} onClick={this.handleFormatContent} />
          </Tooltip>

          <Tooltip title="help">
            <Icon type="question-circle" className={styles.helpButton} onClick={this.showHelpDrawer} />
          </Tooltip>
        </div>

        {/* editor */}
        {this.renderEditor()}

        {this.renderHelpDrawer()}
      </div>
    )
  }
}

export default connect(({ code, save }: ConnectState) => {
  return {
    editorState: code.editorState,
    saveConfigCode: save.configCode,
    highlightLines: code.highlightLines,
  }
})(ConfigEditor);
