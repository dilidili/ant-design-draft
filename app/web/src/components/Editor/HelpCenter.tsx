import React, { ReactNode, useState } from 'react';
import { Icon, Tree } from 'antd';
import styles from './HelpCenter.less';

type TypeTreeNode = {
  name: string;
  key: string;
  description?: ReactNode;
  typescript?: string;
  trigger?: string;
  children?: TypeTreeNode[];
};

const FormTypeTreeData: TypeTreeNode = {
  name: 'Form',
  key: 'Form',
  description: 'Form is used to collect, validate, and submit the user input, usually contains various form items including checkbox, radio, input, select, and etc.',
  typescript: `type FormSchema = {
  items: Array<FormItem | Array<FormItem>>;
  props?: FormSchemaProps;
}`,
  trigger: '@Form',
  children: [],
}

const TypeTreeData: TypeTreeNode[] = [{
  name: 'schema',
  key: 'schema',
  description: <div>The <code>const schema</code> must be assigned with the form config.</div>,
  children: [
    FormTypeTreeData,
  ]
}];

const renderTreeNodes = (nodeList: TypeTreeNode[]): ReactNode => {
  return nodeList.map(node => {
    return (
      <Tree.TreeNode title={node.name} key={node.key} data={node}>
        {Array.isArray(node.children) ? renderTreeNodes(node.children) : null}
      </Tree.TreeNode>
    )
  }); 
}

const DocTree = () => {
  const [ selectedNode, setSelectedNode ] = useState<TypeTreeNode | null>(FormTypeTreeData);
  const [ selectedKeys, setSelectedKeys ] = useState<string[]>([FormTypeTreeData.key]);
  const [ expandedKeys, setExpandedKeys ] = useState<string[]>([FormTypeTreeData.key, 'schema']);

  return (
    <div>
      <Tree
        selectedKeys={selectedKeys}
        expandedKeys={expandedKeys}
        onSelect={(selectedKeys, e) => {
          setSelectedKeys(selectedKeys);
          setSelectedNode(e.node.props.data as TypeTreeNode);
        }}
        onExpand={(expandedKeys) => {
          setExpandedKeys(expandedKeys);
        }}
      >
        {renderTreeNodes(TypeTreeData)}
      </Tree>

        {selectedNode ? (
          <div className={styles.nodeContent}>
            <div><span className={styles.nodeName}>{selectedNode.name}</span> <span className={styles.trigger}>Trigger: {selectedNode.trigger}</span></div>
            <div className={styles.nodeDescription}>{selectedNode.description}</div>
            <pre className={styles.typescript}>{selectedNode.typescript}</pre>
          </div>
        ) : null}
    </div>
  )
}

const HelpCenter = () => {
  return (
    <div className={styles.container}>
      <div className={styles.head1}>Create the config</div>
      <p>With the empty config created (by click the {<Icon type="question-circle" />}), create your form config like so:</p>

      <DocTree />
    </div>
  );
}

export default HelpCenter;