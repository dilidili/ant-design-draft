import React, { ReactNode, useState } from 'react';
import { Icon, Tree, Input } from 'antd';
import styles from './HelpCenter.less';

type TypeTreeNode = {
  name: string;
  key: string;
  description?: ReactNode;
  typescript?: string;
  trigger?: string;
  children?: TypeTreeNode[];
};

const LayoutTypeTreeData = (prefix: string): TypeTreeNode => ({
  name: 'layout',
  key: `${prefix}Layout`,
  description: 'There are three layout for form: horizontal, vertical and multi-column.',
  typescript: `const schema = {
  name: 'DefaultForm',
  form: {
    @LayoutInline
    items: [
      // form items
      @Input
    ],
  },
}`,
  children: [{
    name: 'Horizontal layout',
    key: `${prefix}LayoutHorizontal`,
    description: 'Label and content layout in a same row.',
    trigger: '@LayoutHorizontal(Form or FormItem)',
    typescript: `props: {
  labelCol: { span: 4 },
  wrapperCol: { span: 14 }
}`
  }, {
    name: 'Vertical layout',
    key: `${prefix}LayoutVertical`,
    description: 'Form item content layouts below the row of label.',
    trigger: '@LayoutVertical(Form or FormItem)',
    typescript: `props: {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
}`
  }, {
    name: 'Multi-column form row',
    key: `${prefix}MultiColumnRow`,
    description: 'Multiple form items layout in a same line.',
    trigger: '@Row(Form.items)',
    typescript: `{
  type: 'Row',
  props: {
    gutter: 24,
  },
  layout: [12, 12],
  items: [
    {
      type: 'Input',
      name: 'inputA',
      label: 'Input A',
    }, {
      type: 'Input',
      name: 'inputB',
      label: 'Input B',
    }
  ],
}`,
  }]
});

const FormTypeTreeData: TypeTreeNode = {
  name: 'Form',
  key: 'Form',
  description: 'Form is used to collect, validate, and submit the user input, usually contains various form items including checkbox, radio, input, select, and etc.',
  typescript: `type FormSchema = {
  items: Array<FormItem | Array<FormItem>>;
}`,
  trigger: '@Form',
  children: [LayoutTypeTreeData('Form'), {
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
    }, {
      name: 'Switch',
      key: 'FormItem.Switch',
      description: 'Switching Selector.',
      trigger: '@Switch',
      typescript: `{
  name: 'switch',
  label: 'Switch',
  type: 'Switch',
  props: {
  }
}`,
    }].sort((a, b) => a.name.localeCompare(b. name)),
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

const renderTreeNodes = (nodeList: TypeTreeNode[], searchValue: string): ReactNode => {
  return nodeList.map(node => {
    const title = <span dangerouslySetInnerHTML={{
      __html: node.name.replace(new RegExp(searchValue, 'i'), `<mark>$&</mark>`)
    }} />

    return (
      <Tree.TreeNode title={title} key={node.key} data={node}>
        {Array.isArray(node.children) ? renderTreeNodes(node.children, searchValue) : null}
      </Tree.TreeNode>
    )
  }); 
}

const findSearchExpandedKeys = (children: TypeTreeNode[], value: string): string[] => {
  let ret: string[] = [];

  children.forEach(node => {
    // if the node fulfills the search condition.
    if (node.name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
      ret.push(node.key);
    }

    if (Array.isArray(node.children)) {
      const childrenKeys = findSearchExpandedKeys(node.children, value);

      if (childrenKeys.length > 0) {
        ret.push(node.key);
        ret = ret.concat(childrenKeys);
      }
    }
  })

  return ret;
}

const DocTree = () => {
  const [ selectedNode, setSelectedNode ] = useState<TypeTreeNode | null>(FormTypeTreeData);
  const [ selectedKeys, setSelectedKeys ] = useState<string[]>([FormTypeTreeData.key]);
  const [ expandedKeys, setExpandedKeys ] = useState<string[]>([FormTypeTreeData.key, 'schema', 'Form.items', 'FormLayout']);
  const [ searchValue, setSearchValue ] = useState<string>('');
  const [ searchExpandedKeys, setSearchExpandedKeys ] = useState<string[]>([]);

  const searchWorldChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;

    if (!!value) {
      setSearchExpandedKeys(findSearchExpandedKeys([FormTypeTreeData], value));
      setSearchValue(value);
    } else {
      setSearchExpandedKeys([]);
      setSearchValue('');
    }
  }

  return (
    <div>
      <Input.Search
        autoFocus
        placeholder="Search..."
        onChange={searchWorldChange}
        style={{ width: 316, marginLeft: 5 }}
      />

      <Tree
        selectedKeys={selectedKeys}
        expandedKeys={[...new Set([...expandedKeys, ...searchExpandedKeys, 'schema'])]} // schema can not be close.
        onSelect={(selectedKeys, e) => {
          setSelectedKeys(selectedKeys);
          setSelectedNode(e.node.props.data as TypeTreeNode);
        }}
        onExpand={(expandedKeys) => {
          setExpandedKeys(expandedKeys);
        }}
      >
        {renderTreeNodes(TypeTreeData, searchValue)}
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

const stopPropagation: React.MouseEventHandler = (evt) => evt.stopPropagation();

const HelpCenter = () => {
  return (
    <div
      className={styles.container}
      onClick={stopPropagation} // prevent trigger switch edtior focus.
    >
      <div className={styles.head1}>Create the config</div>
      <p>With the empty config created (by click the {<Icon type="question-circle" />}), create your form config like so:</p>

      <DocTree />
    </div>
  );
}

export default HelpCenter;
