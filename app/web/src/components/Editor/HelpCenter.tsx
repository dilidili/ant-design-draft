import React from 'react';
import { Icon } from 'antd';
import styles from './HelpCenter.less';

const HelpCenter = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.head1}>Create the config</div>
      <p>With the empty config created (by click the {<Icon type="question-circle" />}), create your form config like so:</p>
    </div>
  );
}

export default HelpCenter;