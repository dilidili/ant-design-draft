const Mustache = require('mustache');

const decodeLiteralPrimative = value => {
  if (typeof value === 'string') {
    return `'${value}'`;
  } else if (Array.isArray(value)) {
    return JSON.stringify(value);
  } else {
    return value;
  }
};

const getFormItemElement = (formItem, entries, formProps, config) => {
  let formItemChildren = [];
  let formItemProps = {};
  let formItemGutter;

  if (formItem.type === 'Row') {
    const { layout, items, props } = formItem;
    entries.antdImports.add('Row');
    entries.antdImports.add('Col');

    const rowChildren = items.map((col, k) => {
      return {
        type: 'Col',
        props: {
          span: layout[k],
        },
        children: [getFormItemElement(col, entries, formProps, config)],
      }
    })

    return {
      type: 'Row',
      children: rowChildren,
      props: props || {},
    }
  }

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
        if (config.reactApi === 'Hooks') {
          rules.push(`{ validator: ${validator} }`);
          entries.handlers.push(`
  const ${validator} = (rule, value, callback) => {
    const form = props.form;
    console.warn('TODO: implement ${validator}');
    callback();
  };
`)
        } else {
          rules.push(`{ validator: this.${validator} }`);
          entries.handlers.push(`
  ${validator} = (rule, value, callback) => {
    const form = this.props.form;
    console.warn('TODO: implement ${validator}');
    callback();
  };
`)
        }

      }
    });

    // field children
    let children = [];
    let mounted = false;
    if (type === 'Button') {
      if (onSubmit) {
        formChildrenProps.htmlType = "submit";
      }
    } else if (type === 'Cascader') {
      formChildrenProps.options = [];
    } else if (type === 'Radio.Group') {
      entries.antdImports.add('Radio');

      children.push({
        type: 'Radio.Group',
        props: {},
        children: (formItem.options || []).map(option => ({
          type: 'Radio',
          props: {
            value: option.value,
            children: option.text,
          },
        })),
      });

      mounted = true;
    }
    
    if (!!type && !mounted) {
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
      if (config.reactApi === 'Hooks') {
        entries.handlers.push(`  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };
`)
        formProps.onSubmit = {
          type: 'refrence',
          payload: 'handleSubmit',
        }
      } else {
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

  return formItemElement;
}

const transformFormField = (fieldValue, entries, config = {}) => {
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
      const formItemElement = getFormItemElement(formItem, entries, formProps, config);
      formElement.children.push(formItemElement);
    });
  }

  entries.antdImports.add('Form');
  entries.renderForm.return.push(formElement);
  if (config.reactApi === 'Hooks') {
    entries.renderForm.declares.push('  const { getFieldDecorator } = props.form;');
  } else {
    entries.renderForm.declares.push('    const { getFieldDecorator } = this.props.form;');
  }

  if (config.env === 'browser') {
    entries.template = require('./templates/Form.browser.mustache.js');
  } else {
    if (config.reactApi === 'Hooks') {
      entries.template = require('./templates/Form.hooks.mustache.js');

      if (config.useTypescript) {
        entries.otherImports.push(`import { FormComponentProps } from 'antd/lib/form/Form'`)

        entries.formTsWrapper = () => (text, render) => {
          return render(text)
            + `: FormComponentProps`;
        }
      }
    } else {
      entries.template = require('./templates/Form.mustache.js');

      if (config.useTypescript) {
        entries.otherImports.push(`import { FormComponentProps } from 'antd/lib/form/Form'`)

        entries.formTsWrapper = () => (text, render) => {
          return `interface ${entries.componentType}Props extends FormComponentProps {\n`
            + '}\n\n'
            + render(text)
            + `<${entries.componentType}Props>`;
        }
      }
    }
  }
}

const transformFormInModalField = (fieldValue, entries, config = {}) => {
  transformFormField(fieldValue.form, entries, config);

  const modalElement = {
    type: 'Modal',
    props: {
      visible: {
        type: 'refrence',
        payload: 'visible',
      },
      onCancel: {
        type: 'refrence',
        payload: 'onCancel',
      },
      onOk: {
        type: 'refrence',
        payload: 'onCreate',
      },
      title: fieldValue.title || 'title',
      okText: fieldValue.okText || 'okText',
    },
    children: [{
      type: 'custom',
      render: (indent) => {
        return {
          start: (
            config.reactApi === 'Hooks' ? indent + `<Wrapped${entries.componentType} wrappedComponentRef={wrappedComponentRef} />` : indent + '{this.renderForm()}'
          ),
        }
      },
    }],
  };

  entries.antdImports.add('Button');
  entries.antdImports.add('Modal');
  entries.render.buttonLabel = fieldValue.buttonLabel || 'Button';
  if (config.reactApi === 'Hooks') {
    entries.render.declares.push('  const { visible, onCancel, onCreate, wrappedComponentRef } = props;');
  } else {
    entries.render.declares.push('    const { visible, onCancel, onCreate, form } = this.props;');

    if (config.useTypescript) {
      const originalFormTsWrapper = entries.formTsWrapper;
      entries.formTsProps = `<${entries.componentType}Props>`;

      entries.formTsWrapper = () => (text, render) => {
        let ret = originalFormTsWrapper()(text, render);
        ret = ret.replace('extends FormComponentProps {\n', (
          'extends FormComponentProps {\n'
          + '  visible: boolean;\n'
          + '  onCancel: (e: React.MouseEvent<any>) => void;\n'
          + '  onCreate: (e: React.MouseEvent<any>) => void;\n'
        ))

        return ret;
      }
    }
  }
  entries.render.return.push(modalElement);

  if (config.env === 'browser') {
    entries.template = require('./templates/FormInModal.browser.mustache.js');
  } else {
    if (config.reactApi === 'Hooks') {
      entries.template = require('./templates/FormInModal.hooks.mustache.js');
    } else {
      entries.template = require('./templates/FormInModal.mustache.js');
    }
  }
}

const transformField = (fieldName, fieldValue, entries, config) => {
  switch(fieldName) {
    case 'form':
      transformFormField(fieldValue, entries, config);
      break;
    case 'formInModal':
      transformFormInModalField(fieldValue, entries, config);
      break;
    case 'name':
      entries.componentType = fieldValue || '';
      break;
    default:
  }
};

const renderProps = (child, renderEntries) => {
  const props = child.props || {};

  return Object.keys(props).reduce((r, k) => {
    const prop = props[k];

    // ignore children props
    if (k === 'children') return r;

    if (typeof prop === 'string') {
      return r + ` ${k}="${props[k]}"`;
    } else if (typeof prop === 'number' || typeof prop === 'boolean') {
      return r + ` ${k}={${props[k]}}`;
    } else if (prop && prop.type === 'refrence') {
      return r + ` ${k}={${props[k].payload}}`;
    } else if (Array.isArray(prop)) {
      return r + ` ${k}={${JSON.stringify(prop)}}`;
    } else if (typeof prop === 'object') {
      const typeName = child.type.replace('.', '');
      const propName = `${typeName[0].toLowerCase()}${typeName.slice(1)}${k[0].toUpperCase()}${k.slice(1)}Prop`;
      renderEntries.declareMap[JSON.stringify(prop, null, 2)] = propName;
      return r + ` ${k}={${propName}}`;
    } 

    return r;
  }, '')
};

const renderElements = (children = [], indentNums, entries, renderEntries) => {
  const indent = ' '.repeat(indentNums);
  let ret = [];

  if (Array.isArray(children)) {
    children.forEach(child => {
      const {
        type,
      } = child;

      child.props = child.props || {};
      const props = renderProps(child, renderEntries);
      const nextLevelChildren = child.children || child.props.children;

      if (type === 'custom') {
        const { start, end } = child.render(indent);
        ret.push(start); 
        if (nextLevelChildren) {
          ret = ret.concat(renderElements(nextLevelChildren, indentNums + 2, entries, renderEntries));
        }
        if (end) {
          ret.push(end); 
        }
      } else if (nextLevelChildren && nextLevelChildren.length > 0) {
        ret.push(`${indent}<${type}${props}>`);
        ret = ret.concat(renderElements(nextLevelChildren, indentNums + 2, entries, renderEntries));
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

const generate = (entries, config = {}) => {
  const {
    antdImports,
    otherImports,
    handlers,
  } = entries;

  const view = {
    componentType: entries.componentType,
    handlers,
    render: {
      ...entries.render,
      return: '',
    },
    renderForm: {
      ...entries.renderForm,
      return: '',
    },
    formTsWrapper: entries.formTsWrapper,
    formTsProps: entries.formTsProps || '',
  };

  if (antdImports && antdImports.size) {
    if (config.env === 'browser') {
      view.antdImports = `const { ${[...antdImports].join(', ')} } = window.AntD;`
    } else {
      view.antdImports = `import { ${[...antdImports].join(', ')} } from 'antd';`
    }
  } else {
    view.antdImports = null;
  }

  if (otherImports && otherImports.length) {
    view.antdImports = [view.antdImports].concat(otherImports).filter(v => !!v).join('\n');
  }

  const renderReturnIndent = config.reactApi === 'Hooks' ? 4 : 6;
  if (entries.render.return && entries.render.return.length > 0) {
    view.render.return = renderElements(entries.render.return, renderReturnIndent, entries, entries.render).join('\n');
  }
  if (entries.renderForm.return && entries.renderForm.return.length > 0) {
    view.renderForm.return = renderElements(entries.renderForm.return, renderReturnIndent, entries, entries.renderForm).join('\n');
  }

  const indent = config.reactApi === 'Hooks' ? '  ' : '    ';

  // transform declareMap to list format
  view.render.declareMap = Object.keys(view.render.declareMap).reduce((r, k) => {
    r.push(`const ${view.render.declareMap[k]} = ${k};`.split('\n').map(v => indent + v).join('\n'));
    return r;
  }, []);
  view.renderForm.declareMap = Object.keys(view.renderForm.declareMap).reduce((r, k) => {
    r.push(`const ${view.renderForm.declareMap[k]} = ${k};`.split('\n').map(v => indent + v).join('\n'));
    return r;
  }, []);

  let ret = Mustache.render(entries.template, view);
  ret = postGenerate(ret, view, config);
  return ret;
};

const postGenerate = (code, view, config) => {
  if (config.useTypescript) {
    // form in modal
    if (config.reactApi === 'Hooks') {
      code = code.replace(`const ${view.componentType}Modal = (props) => {`,
        `interface ${view.componentType}ModalProps {
  visible: boolean;
  onCancel: (e: React.MouseEvent<any>) => void;
  onCreate: (e: React.MouseEvent<any>) => void;
  wrappedComponentRef: any;
}

const ${view.componentType}Modal = (props: ${view.componentType}ModalProps) => {`
      )
      code = code.replace('const inputRef = useRef();', 'const inputRef = useRef<FormComponentProps>();')
      code = code.replace('const handleSubmit = e => {', 'const handleSubmit = (e: React.MouseEvent<any>) => {')
    } else {
      code = code.replace(`class ${view.componentType}Button extends React.Component {
  state = {
    visible: false,
  };`, `class ${view.componentType}Button extends React.Component {
  state = {
    visible: false,
  };
  
  formRef?: ${view.componentType};`)
      code = code.replace('saveFormRef = formRef => {', 'saveFormRef = (formRef?: CollectionCreateForm) => {')
      code = code.replace('handleSubmit = e => {', 'handleSubmit = (e: React.MouseEvent<any>) => {')
    }
  }

  return code;
}

const transform = (schema = {}, config = {}) => {
  const entries = {
    antdImports: new Set(),
    otherImports: [],
    handlers: [],
    render: {
      declareMap: {},
      declares: [],
      return: [],
    },
    renderForm: {
      declareMap: {},
      declares: [],
      return: [],
    },
    formTsWrapper: () => (text, render) => render(text),
  };

  Object.keys(schema).forEach(key => {
    transformField(key, schema[key], entries, config);
  });

  // generate
  const content = generate(entries, config);

  return content;
}

module.exports = transform;