const Mustache = require('mustache');
const fs = require('fs');
const path = require('path');

const ReactComponentTpl = fs.readFileSync(path.join(__dirname, './templates/ReactComponent.mustache'), 'utf8');

const transformFormField = (fieldValue, entries) => {
  const {
    onSubmit,
    ...formProps
  } = fieldValue;

  entries.antdImports.push('Form');

  entries.render.return.push({
    type: 'Form',
    props: {
      ...formProps,
    },
  })
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
    if (typeof props[k] === 'string') {
      return r + ` ${k}="${props[k]}"`
    }

    return r;
  }, '')
};

const renderElements = (children, indentNums) => {
  const indent = ' '.repeat(indentNums);
  const ret = [];

  children.forEach(child => {
    const {
      type,
    } = child;

    const props = renderProps(child.props);

    if (child.children && child.children.length > 0) {
      ret.push(`${indent}<Form${props}>`);
      ret = ret.concat(renderElements(child.children, indentNums + 2));
      ret.push(`${indent}</Form>`);
    } else {
      ret.push(`${indent}<${type}${props} />`);
    }
  });

  return ret;
};

const generate = (entries) => {
  const {
    antdImports,
  } = entries;

  const view = {
    componentType: entries.componentType,
    render: {
      return: '',
    }
  };

  if (antdImports && antdImports.length > 0) {
    view.antdImports = `import { ${antdImports.join(', ')} } from 'antd';`
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
    antdImports: [],
    render: {
      return: [],
    },
  };

  Object.keys(schema).forEach(key => {
    transformField(key, schema[key], entries);
  });

  // generate
  const content = generate(entries);
  console.log(content);
}

module.exports = transform;