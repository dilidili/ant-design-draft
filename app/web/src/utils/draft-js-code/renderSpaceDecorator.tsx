import React from 'react';
import { ContentBlock, ContentState } from 'draft-js';
import styles from './SpaceSpan.less';

class SpaceSpan extends React.Component<{
  children: React.ReactChildren;
}> {
  render() {
    return <span className={styles.space}>{this.props.children}</span>
  }
}

function spaceStrategy(contentBlock: ContentBlock, callback: Function, contentState: ContentState) {
  const text = contentBlock.getText();
  for(let ii = 0; ii < text.length; ii ++) {
    if (text[ii] === ' ') {
      callback(ii, ii + 1);
    }
  }
}

export default {
  strategy: spaceStrategy,
  component: SpaceSpan,
};