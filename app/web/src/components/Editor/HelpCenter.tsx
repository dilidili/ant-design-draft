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
}`,
  trigger: '@Form',
  children: [{
    name: 'items',
    key: 'Form.items',
    description: 'A form consists of one or more form fields whose type includes input, textarea, checkbox, radio, select, tag, and more. A form field is defined using FormItem.',
    typescript: `export type FormItem = {
  type: 'Row' | 'Divider' | 'Button' | 'Cascader' | 'Radio.Group';
  name: string; // the name of value when submit
  label?: React.ReactNode; // Form field label
  hasFeedback?: boolean;
  valuePropName?: string | Array<any>;
  initialValue?: string | Array<any>;
  props: any; // props pass to wrapped component.
}`,
    children: [{
      name: 'Input',
      key: 'FormItem.Input',
      description: 'A basic widget for getting the user input is a text field. Keyboard and mouse can be used for providing or changing data.',
      trigger: '@Input',
      typescript: `{
  name: 'email',
  label: 'E-mail',
  type: 'Input',
  rules: ['required', 'email'],
}`,
    }, {
      name: 'Select',
      key: 'FormItem.Select',
      description: 'Select component to select value from options.',
      trigger: '@Select',
      typescript: `{
  name: 'attendees',
  label: 'Attendees',
  type: 'Select',
  rules: ['required'],
}`,
    }, {
      name: 'DatePicker',
      key: 'FormItem.DatePicker',
      description: 'To select or input a date.',
      trigger: '@DatePicker',
      typescript: `{
  name: 'birthday',
  label: 'Birthday',
  type: 'DatePicker',
  rules: ['required'],
  props: {
    showTime: true,
    format: 'YYYY-MM-DD HH:mm:ss',
  }
}`,
    }, {
      name: 'TimePicker',
      key: 'FormItem.TimePicker',
      description: 'To select or input a time.',
      trigger: '@TimePicker',
      typescript: `{
  name: 'timePicker',
  label: 'TimePicker',
  type: 'TimePicker',
  rules: ['required'],
  props: {
    format: 'HH:mm:ss',
  }
}`,
    }, {
      name: 'RangePicker',
      key: 'FormItem.RangePicker',
      description: 'To select or input a date range.',
      trigger: '@RangePicker',
      typescript: `{
  name: 'rangePicker',
  label: 'RangePicker',
  type: 'DatePicker.RangePicker',
  rules: ['required'],
  props: {
    showTime: true,
    format: 'YYYY-MM-DD HH:mm:ss',
  }
}`,
    }],
  }],
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
  const [ expandedKeys, setExpandedKeys ] = useState<string[]>([FormTypeTreeData.key, 'schema', 'Form.items']);

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
    <div
      className={styles.container}
      onClick={evt => evt.stopPropagation()} // prevent trigger switch edtior focus.
    >
      <div className={styles.head1}>Create the config</div>
      <p>With the empty config created (by click the {<Icon type="question-circle" />}), create your form config like so:</p>

      <DocTree />
    </div>
  );
}

export default HelpCenter;