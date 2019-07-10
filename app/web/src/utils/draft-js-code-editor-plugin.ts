import CodeUtils from './draft-js-code';

type Options = {};

type EditorState = Object;
type PluginFunctions = {
  setEditorState: Function,
  getEditorState: Function,
};
type Command = string;

const createCodeEditorPlugin = (options?: Options) => {
  return {
    handleKeyCommand(command: Command, editorState: EditorState, { setEditorState }: PluginFunctions) {
      let newState;

      newState = CodeUtils.handleKeyCommand(editorState, command);

      if (newState) {
        setEditorState(newState);
        return 'handled';
      }
      return 'not-handled';
    },
    keyBindingFn(evt: Event, { getEditorState, setEditorState }: PluginFunctions) {
      const editorState = getEditorState();

      return CodeUtils.getKeyBinding(evt);
    },
    handleReturn(evt: Event, editorState: EditorState, { setEditorState }: PluginFunctions) {

      setEditorState(CodeUtils.handleReturn(evt, editorState));
      return 'handled';
    },
    onTab(evt: Event, { getEditorState, setEditorState }: PluginFunctions) {
      const editorState = getEditorState()

      setEditorState(CodeUtils.onTab(evt, editorState));
      return 'handled';
    }
  }
}

export default createCodeEditorPlugin;
