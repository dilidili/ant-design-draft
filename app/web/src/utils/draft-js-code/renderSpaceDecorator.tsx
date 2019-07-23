import React from 'react';
import { ContentBlock, ContentState } from 'draft-js';
import styles from './SpaceSpan.less';

class SpaceSpan extends React.Component<{
  childrent: React.ReactChildren;
}> {
  render() {
    return <span className={styles.space}>·</span>
    return <span className={styles.space}>{this.props.children}</span>;
  }
}

function spaceStrategy(contentBlock: ContentBlock, callback: Function, contentState: ContentState) {
  const text = contentBlock.getText();
  let char, ii = 0;
  while((char = text[ii])) {
    if (char === ' ') {
      callback(ii, ii + 1);
      ii++;
    } else {
      break;
    }
  }
}

export default {
  strategy: spaceStrategy,
  component: SpaceSpan,
};