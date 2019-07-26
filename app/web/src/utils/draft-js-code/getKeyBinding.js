/**
 * Return command for a keyboard event
 *
 * @param {SyntheticKeyboardEvent} event
 * @return {String}
 */
function getKeyBinding(e) {
  if (e.metaKey && e.shiftKey && e.key === 'f') {
    e.preventDefault();
    e.stopPropagation();

    return 'format-code';
  } else if (e.metaKey && e.key === '/') {
    e.preventDefault();
    e.stopPropagation();

    return 'toggle-helper';
  }
}

module.exports = getKeyBinding;
