const Mustache = require('mustache');
const fs = require('fs');
const path = require('path');

const ReactComponentTpl = fs.readFileSync(path.join(__dirname, './templates/ReactComponent.mustache'), 'utf8');

const decodeLiteralPrimative = value => {
  if (typeof value === 'string') {
    return `'${value}'`;
  } else {
    return value;
  }
};

const transformFormField = (fieldValue, entries) => {
  const {
    items,
    props: formProps = {},
  } = fieldValue;

  const formElement = {
    type: 'Form',
    props: formProps,
    children: [],
  };

  // FormItem
  if (items && items.length) {
    items.forEach(formItem => {
      let formItemChildren = [];
      let formItemProps = {};

      // support array as element of items
      let formItemList = formItem;
      if (!Array.isArray(formItem)) {
        formItemList = [formItem];
      }

      formItemList.forEach(formItem => {
        const {
          type,
          onSubmit,
          name,
          label,
          valuePropName,
          initialValue,
          rules: formItemRules,
          props: formChildrenProps,
        } = formItem;

        if (label) formItemProps.label = label;
  
        // field rules
        const rules = [];
        (formItemRules || []).forEach(rule => {
          if (rule === 'required') {
            rules.push(`{ required: true, message: 'Please input your ${formItem.name}!' }`);
          } else if (rule === 'email') {
            rules.push(`{ type: 'email', message: 'The input is not valid E-mail!' }`);
          }
        });

        // field children
        let children = [];
        if (type === 'Input') {
          entries.antdImports.add('Input');
          children.push({
            type: 'Input',
            props: formChildrenProps,
          });
        } else if (type === 'Button') {
          entries.antdImports.add('Button');

          if (onSubmit) {
            formChildrenProps.htmlType = "submit";
          }

          children.push({
            type: 'Button',
            props: formChildrenProps,
          });
        } else if (type === 'Checkbox') {
          entries.antdImports.add('Checkbox');

          children.push({
            type: 'Checkbox',
            props: formChildrenProps,
          });
        } else if (!!type) {
          children.push({
            type: type,
            props: formChildrenProps,
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
              const valuePropNameProp = valuePropName !== undefined ? indent + '  ' + `valuePropName: ${decodeLiteralPrimative(valuePropName)},\n` : '';
              const initialValueProp = initialValue !== undefined ? indent + '  ' + `initialValue: ${decodeLiteralPrimative(initialValue)},\n` : ''

              return {
                start: (
                  indent + `{getFieldDecorator('${formItem.name}', {\n`
                  + indent + '  ' + `rules: [${rules.join(', ')}],\n`
                  + valuePropNameProp
                  + initialValueProp
                  + indent + '})('
                ),
                end: (
                  indent + `)}`
                )
              }
            },
          }]
        }

        formItemChildren = formItemChildren.concat(children);
      })


      const formItemElement = {
        type: 'Form.Item',
        children: formItemChildren,
        props: formItemProps,
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

const renderProps = (props = {}, entries, child) => {
  return Object.keys(props).reduce((r, k) => {
    const prop = props[k];

    if (typeof prop === 'string') {
      return r + ` ${k}="${props[k]}"`;
    } else if (prop && prop.type === 'refrence') {
      return r + ` ${k}={${props[k].payload}}`;
    } else if (typeof prop === 'object') {
      const propName = `${child.type[0].toLowerCase()}${child.type.slice(1)}${k[0].toUpperCase()}${k.slice(1)}Prop`;
      entries.render.declareMap[JSON.stringify(prop, null, 2)] = propName;
      return r + ` ${k}={${propName}}`;
    } 

    return r;
  }, '')
};

const renderElements = (children = [], indentNums, entries) => {
  const indent = ' '.repeat(indentNums);
  let ret = [];

  children.forEach(child => {
    const {
      type,
    } = child;

    const props = renderProps(child.props, entries, child);

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
    view.render.return = renderElements(entries.render.return, 6, entries).join('\n');
  }

  // transform delareMap to list format
  view.render.declareMap = Object.keys(view.render.declareMap).reduce((r, k) => {
    r.push(`const ${view.render.declareMap[k]} = ${k};`.split('\n').map(v => '    ' + v).join('\n'));
    return r;
  }, [])

  return Mustache.render(ReactComponentTpl, view);
};

const transform = (schema = {}) => {
  const entries = {
    antdImports: new Set(),
    handlers: [],
    render: {
      declareMap: {},
      declares: [],
      return: [],
    },
  };

  Object.keys(schema).forEach(key => {
    transformField(key, schema[key], entries);
  });

  // generate
  const content = generate(entries);

  return content;
}

module.exports = transform;