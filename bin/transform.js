const Mustache = require('mustache');
const fs = require('fs');
const path = require('path');

const ReactComponentTpl = fs.readFileSync(path.join(__dirname, './templates/ReactComponent.mustache'), 'utf8');

const transformFormField = (fieldValue, entries) => {
  const {
    items,
    ...formProps
  } = fieldValue;

  const formElement = {
    type: 'Form',
    props: formProps,
    children: [],
  };

  // FormItem
  if (items && items.length) {
    items.forEach(formItem => {
      const {
        type,
        onSubmit,
        name,
        rules: formItemRules,
        props: formItemProps,
      } = formItem;

      // field rules
      const rules = [];
      (formItemRules || []).forEach(rule => {
        if (rule === 'required') {
          rules.push(`{ required: true, message: 'Please input your ${formItem.name}!' }`);
        }
      });

      // field children
      let children = [];
      if (type === 'Input') {
        entries.antdImports.add('Input');
        children.push({
          type: 'Input',
          props: formItemProps,
        });
      } else if (type === 'Button') {
        entries.antdImports.add('Button');

        if (onSubmit) {
          formItemProps.htmlType = "submit";
        }

        children.push({
          type: 'Button',
          props: formItemProps,
        });
      }

      // form submit
      if (onSubmit) {
        entries.handlers.push(`
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };
`)

        formProps.onSubmit = {
          type: 'refrence',
          payload: 'this.handleSubmit',
        }
      }

      // children
      if (name) {
        children = [{
          type: 'custom',
          children,
          render: (indent) => {
            return {
              start: (
                indent + `{getFieldDecorator('${formItem.name}', {\n`
                + indent + '  ' + `rules: [${rules.join(', ')}]\n` +
                indent + '})('
              ),
              end: (
                indent + `)}`
              )
            }
          },
        }]
      }

      const formItemElement = {
        type: 'Form.Item',
        children,
      };

      formElement.children.push(formItemElement);
    });
  }

  entries.antdImports.add('Form');
  entries.render.return.push(formElement);
  entries.render.declares.push('    const { getFieldDecorator } = this.props.form;');
}

const transformField = (fieldName, fieldValue, entries) => {
  switch(fieldName) {
    case 'form':
      transformFormField(fieldValue, entries);
      break;
    case 'componentType':
      entries.componentType = fieldValue || '';
      break;
    default:
  }
};

const renderProps = (props = {}) => {
  return Object.keys(props).reduce((r, k) => {
    const prop = props[k];

    if (typeof prop === 'string') {
      return r + ` ${k}="${props[k]}"`
    } else if (prop && prop.type === 'refrence') {
      return r + ` ${k}={${props[k].payload}}`
    }

    return r;
  }, '')
};

const renderElements = (children = [], indentNums) => {
  const indent = ' '.repeat(indentNums);
  let ret = [];

  children.forEach(child => {
    const {
      type,
    } = child;

    const props = renderProps(child.props);

    if (type === 'custom') {
      const { start, end } = child.render(indent);
      ret.push(start); 
      ret = ret.concat(renderElements(child.children, indentNums + 2));
      ret.push(end); 
    } else if (child.children && child.children.length > 0) {
      ret.push(`${indent}<${type}${props}>`);
      ret = ret.concat(renderElements(child.children, indentNums + 2));
      ret.push(`${indent}</${type}>`);
    } else {
      ret.push(`${indent}<${type}${props} />`);
    }
  });

  return ret;
};

const generate = (entries) => {
  const {
    antdImports,
    handlers,
  } = entries;

  const view = {
    componentType: entries.componentType,
    handlers,
    render: {
      ...entries.render,
      return: '',
    }
  };

  if (antdImports && antdImports.size) {
    view.antdImports = `import { ${[...antdImports].join(', ')} } from 'antd';`
  } else {
    view.antdImports = null;
  }

  if (entries.render.return && entries.render.return.length > 0) {
    view.render.return = renderElements(entries.render.return, 6).join('\n');
  }

  return Mustache.render(ReactComponentTpl, view);
};

const transform = (schema = {}) => {
  const entries = {
    antdImports: new Set(),
    handlers: [],
    render: {
      declares: [],
      return: [],
    },
  };

  Object.keys(schema).forEach(key => {
    transformField(key, schema[key], entries);
  });

  // generate
  const content = generate(entries);

  fs.writeFileSync(path.join(__dirname, '../src/pages/examples/horizontal-login-form.tsx'), content, 'utf8');
}

module.exports = transform;