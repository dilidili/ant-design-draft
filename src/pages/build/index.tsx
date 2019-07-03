import React from 'react';
import { Icon } from 'antd';
import CodeEditor from '@/components/Editor/CodeEditor';
import ConfigEditor from '@/components/Editor/ConfigEditor';
import { Spring } from 'react-spring/renderprops'
import dynamic from 'umi/dynamic';
import styles from './index.less';

enum BuildPageTab {
  ConfigEditor,
  Preview,
  CodeEditor,
};

const Preview: any = dynamic({
  loader: () => import('@/components/Editor/Preview'),
})

class BuildPage extends React.Component {
  state = {
    currentVisibleTab: new Set([BuildPageTab.ConfigEditor, BuildPageTab.Preview, BuildPageTab.CodeEditor]),
  }

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
    const { currentVisibleTab } = this.state;
    const widthPerTab = ~~(90 / currentVisibleTab.size) + '%';

    return (
      <div className={styles.content}>
        {/* config input */}
        <Spring
          to={{
            opacity: currentVisibleTab.has(BuildPageTab.ConfigEditor) ? 1 : 0,
            width: currentVisibleTab.has(BuildPageTab.ConfigEditor) ? widthPerTab : '0%',
          }}
        >
          {props => (
            <div
              className={styles.contentBlock}
              style={props}
              onFocus={() => this.setState({
                currentVisibleTab: new Set([BuildPageTab.ConfigEditor, BuildPageTab.Preview]),
              })}
              onBlur={() => this.setState({
                currentVisibleTab: new Set([BuildPageTab.ConfigEditor, BuildPageTab.Preview, BuildPageTab.CodeEditor]),
              })}
            >
              <div className={styles.contentHeader}><div/><p>Config</p><div/></div>
              <ConfigEditor />
            </div>
          )}
        </Spring>

        {/* preview */}
        <Spring
          to={{
            opacity: currentVisibleTab.has(BuildPageTab.Preview) ? 1 : 0,
            width: currentVisibleTab.has(BuildPageTab.Preview) ? widthPerTab : '0%',
          }}
        >
          {props => (
            <div className={styles.contentBlock} style={props}>
              <div className={styles.contentHeader}><div/><p>Preview</p><div/></div>
              <Preview />
            </div>
          )}
        </Spring>

        {/* code */}
        <Spring
          to={{
            opacity: currentVisibleTab.has(BuildPageTab.CodeEditor) ? 1 : 0,
            width: currentVisibleTab.has(BuildPageTab.CodeEditor) ? widthPerTab : '0%',
          }}
        >
          {props => (
            <div
              className={styles.contentBlock}
              style={props}
            >
              <div className={styles.contentHeader}><div/><p>Code</p><div/></div>
              <CodeEditor />
            </div>
          )}
        </Spring>
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

