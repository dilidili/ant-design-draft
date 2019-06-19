const Mustache = require('mustache');
const fs = require('fs');
const path = require('path');

const ReactComponentTpl = fs.readFileSync(path.join(__dirname, './templates/ReactComponent.mustache'), 'utf8');

const decodeLiteralPrimative = value => {
  if (typeof value === 'string') {
    return `'${value}'`;
  } else if (Array.isArray(value)) {
    return JSON.stringify(value);
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
      let formItemGutter;

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
          hasFeedback,
          extra,
          valuePropName,
          wrapperCol,
          initialValue,
          span,
          validators,
          gutter,
          rules: formItemRules,
          props: formChildrenProps = {},
        } = formItem;

        if (label) formItemProps.label = label;
        if (hasFeedback) formItemProps.hasFeedback = true;
        if (extra) formItemProps.extra = extra;
        if (wrapperCol) formItemProps.wrapperCol = wrapperCol;
        if (gutter) formItemGutter = gutter;
  
        // field rules
        const rules = [];
        (formItemRules || []).forEach(rule => {
          if (rule === 'required') {
            rules.push(`{ required: true, message: 'Please input your ${formItem.name}!' }`);
          } else if (rule === 'email') {
            rules.push(`{ type: 'email', message: 'The input is not valid E-mail!' }`);
          }
        });

        (validators || []).forEach(validator => {
          if (validator) {
            rules.push(`{ validator: this.${validator} }`);
            entries.handlers.push(`
  ${validator} = (rule, value, callback) => {
    const form = this.props.form;
    console.warn('TODO: implement ${validator}');
    callback();
  };
`)
          }
        });

        // field children
        let children = [];
        if (type === 'Button') {
          if (onSubmit) {
            formChildrenProps.htmlType = "submit";
          }
        } else if (type === 'Cascader') {
          formChildrenProps.options = [];
        }
        
        if (!!type) {
          if (!~type.indexOf('.') && type.toLowerCase() !== type) {
            entries.antdImports.add(type);
          }

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

        if (typeof span === 'number') {
          entries.antdImports.add('Col');
          children = [{
            type: 'Col',
            props: {
              span,
            },
            children,
          }]
        }

        formItemChildren = formItemChildren.concat(children);
      })


      let formItemElement = {
        type: 'Form.Item',
        children: formItemChildren,
        props: formItemProps,
      };

      // wrap with row layout
      if (typeof formItemGutter === 'number') {
        entries.antdImports.add('Row');
        formItemElement.children = [{
          type: 'Row',
          props: {
            gutter: formItemGutter,
          },
          children: formItemElement.children,
        }]
      }

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

    // ignore children props
    if (k === 'children') return r;

    if (typeof prop === 'string') {
      return r + ` ${k}="${props[k]}"`;
    } else if (typeof prop === 'number') {
      return r + ` ${k}={${props[k]}}`;
    } else if (prop && prop.type === 'refrence') {
      return r + ` ${k}={${props[k].payload}}`;
    } else if (Array.isArray(prop)) {
      return r + ` ${k}={${JSON.stringify(prop)}}`;
    } else if (typeof prop === 'object') {
      const typeName = child.type.replace('.', '');
      const propName = `${typeName[0].toLowerCase()}${typeName.slice(1)}${k[0].toUpperCase()}${k.slice(1)}Prop`;
      entries.render.declareMap[JSON.stringify(prop, null, 2)] = propName;
      return r + ` ${k}={${propName}}`;
    } 

    return r;
  }, '')
};

const renderElements = (children = [], indentNums, entries) => {
  const indent = ' '.repeat(indentNums);
  let ret = [];

  if (Array.isArray(children)) {
    children.forEach(child => {
      const {
        type,
      } = child;

      child.props = child.props || {};
      const props = renderProps(child.props, entries, child);
      const nextLevelChildren = child.children || child.props.children;

      if (type === 'custom') {
        const { start, end } = child.render(indent);
        ret.push(start); 
        ret = ret.concat(renderElements(nextLevelChildren, indentNums + 2, entries));
        ret.push(end); 
      } else if (nextLevelChildren && nextLevelChildren.length > 0) {
        ret.push(`${indent}<${type}${props}>`);
        ret = ret.concat(renderElements(nextLevelChildren, indentNums + 2, entries));
        ret.push(`${indent}</${type}>`);
      } else {
        ret.push(`${indent}<${type}${props} />`);
      }
    });
  } else if (typeof children === 'string') {
    ret.push(`${indent}${children}`);
  }

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