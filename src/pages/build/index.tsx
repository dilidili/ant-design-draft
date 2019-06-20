import React from 'react';
import { Icon } from 'antd';
import styles from './index.less';
import ConfigEditor from './ConfigEditor';

class BuildPage extends React.Component {

  renderHeader() {
    return (
      <div className={styles.header}>
        <div>
          <Icon type="profile" theme="filled" />
          <div><span style={{ color: 'black', fontWeight: 500, fontSize: '16px', display: 'inline-block', marginRight: 5 }}>Form Builder</span> Build your own forms quickly.</div>
        </div>
      </div>
    )
  }

  renderContent() {
    return (
      <div className={styles.content}>
        {/* config input */}
        <div className={styles.contentBlock}>
          <div className={styles.contentHeader}><div/><p>Config</p><div/></div>
          <ConfigEditor />
        </div>

        {/* preview */}
        <div className={styles.contentBlock}>
          <div className={styles.contentHeader}><div/><p>Preview</p><div/></div>
        </div>

        {/* code */}
        <div className={styles.contentBlock}>
          <div className={styles.contentHeader}><div/><p>Code</p><div/></div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderHeader()}
        {this.renderContent()}
      </div>
    )
  }
}

export default BuildPage;

