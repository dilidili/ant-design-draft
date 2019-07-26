import React, { MouseEventHandler, ReactNode, ReactElement } from 'react';
import { Icon, Button } from 'antd';
import CodeEditor from '@/components/Editor/CodeEditor';
import ConfigEditor from '@/components/Editor/ConfigEditor';
import { Spring } from 'react-spring/renderprops'
import dynamic from 'umi/dynamic';
import DocumentTitle from 'react-document-title';
import enhanceWithClickOutside from 'react-click-outside';
import styles from './index.less';

enum BuildPageTab {
  ConfigEditor,
  Preview,
  CodeEditor,
};

const Preview: any = dynamic({
  loader: () => import('@/components/Editor/Preview'),
})

type ClickOutsideWrapperProps = {
  children: ReactElement;
  handleClickOutside: Function;
};

class ClickOutside extends React.Component<ClickOutsideWrapperProps> {
  constructor(props: ClickOutsideWrapperProps) {
    super(props);

    this.handleClickOutside = props.handleClickOutside;
  }

  handleClickOutside: Function;

  render() {
    return this.props.children;
  }
}
const ClickOutsideWrapper = enhanceWithClickOutside(ClickOutside);

class BuildPage extends React.Component {
  state = {
    currentVisibleTab: new Set([BuildPageTab.ConfigEditor, BuildPageTab.Preview, BuildPageTab.CodeEditor]),
  }

  onFocusConfigEditor = () => this.setState({
    currentVisibleTab: new Set([BuildPageTab.ConfigEditor, BuildPageTab.Preview]),
  })

  onFocusCodeEditor = () => this.setState({
    currentVisibleTab: new Set([BuildPageTab.CodeEditor]),
  })

  handleClickOutside: MouseEventHandler = () => {
    this.setState({
      currentVisibleTab: new Set([BuildPageTab.ConfigEditor, BuildPageTab.Preview, BuildPageTab.CodeEditor]),
    });
  }

  renderHeader() {
    return (
      <div className={styles.header}>
        <div>
          <Icon type="profile" theme="filled" />
          <div><span style={{ color: 'black', fontWeight: 500, fontSize: '16px', display: 'inline-block', marginRight: 5 }}>Form Builder</span> Build your own forms quickly.</div>
          <Button style={{ color: 'black', marginLeft: 'auto' }} type="link" onClick={() => window.open('https://github.com/dilidili/ant-design-draft', '_blank')}><Icon type="github" /></Button>
        </div>
      </div>
    )
  }

  renderContent() {
    const { currentVisibleTab } = this.state;
    const widthPerTab = ~~((100 - 3 * (currentVisibleTab.size - 1)) / currentVisibleTab.size) + '%';

    return (
      <div className={styles.content}>
        {/* config input */}
        <Spring<{ height?: string, overflow?: string, opacity: number, width: string, marginLeft: string }>
          to={{
            opacity: currentVisibleTab.has(BuildPageTab.ConfigEditor) ? 1 : 0,
            width: currentVisibleTab.has(BuildPageTab.ConfigEditor) ? widthPerTab : '0%',
            marginLeft: !currentVisibleTab.has(BuildPageTab.CodeEditor) ? '1.5%' : '0%',
          }}
          after={!currentVisibleTab.has(BuildPageTab.ConfigEditor) ? { height: '0px', overflow: 'hidden' } : {}}
        >
          {props => (
            <div
              className={styles.contentBlock}
              style={props}
            >
              <div className={styles.contentHeader}><div/><p>Config</p><div/></div>
              <ConfigEditor
                onFocus={this.onFocusConfigEditor}
              />
            </div>
          )}
        </Spring>

        {/* preview */}
        <Spring<{ height?: string, overflow?: string, opacity: number, width: string }>
          to={{
            opacity: currentVisibleTab.has(BuildPageTab.Preview) ? 1 : 0,
            width: currentVisibleTab.has(BuildPageTab.Preview) ? widthPerTab : '0%',
          }}
          after={!currentVisibleTab.has(BuildPageTab.Preview) ? { height: '0px', overflow: 'hidden' } : {}}
        >
          {props => (
            <div className={styles.contentBlock} style={props}>
              <div className={styles.contentHeader}><div/><p>Preview</p><div/></div>
              <Preview />
            </div>
          )}
        </Spring>

        {/* code */}
        <Spring<{ height?: string, overflow?: string, opacity: number, width: string }>
          to={{
            opacity: currentVisibleTab.has(BuildPageTab.CodeEditor) ? 1 : 0,
            width: currentVisibleTab.has(BuildPageTab.CodeEditor) ? widthPerTab : '0%',
          }}
          after={!currentVisibleTab.has(BuildPageTab.CodeEditor) ? { height: '0px', overflow: 'hidden' } : {}}
        >
          {props => (
            <div
              className={styles.contentBlock}
              style={props}
            >
              <div className={styles.contentHeader}><div/><p>Code</p><div/></div>
              <CodeEditor
                onFocus={this.onFocusCodeEditor}
              />
            </div>
          )}
        </Spring>
      </div>
    )
  }

  render() {
    return (
      <DocumentTitle title='Form Builder'>
        <div>
          {this.renderHeader()}

          <div style={{ padding: '0 40px' }}>
            <ClickOutsideWrapper handleClickOutside={this.handleClickOutside}>
              {this.renderContent()}
            </ClickOutsideWrapper>
          </div>
        </div>
      </DocumentTitle>
    )
  }
}

export default BuildPage;

