var removeIndent = require('./utils/removeIndent');

/**
 * Handle key command for code blocks
 *
 * @param {Draft.EditorState} editorState
 * @param {String} command
 * @return {Boolean}
 */
function handleKeyCommand(editorState, command, options) {
  if (command === 'backspace') {
    return removeIndent(editorState);
  } else if (command === 'format-code') {
    if (options && options.getDispatch) {
      const dispatch = options.getDispatch();

      dispatch({
        type: 'code/prettifyConfigEditor',
      });
    }
  } else if (command === 'toggle-helper') {
    if (options && options.toggleHelper) {
      options.toggleHelper();
    }
  }
}

module.exports = handleKeyCommand;
