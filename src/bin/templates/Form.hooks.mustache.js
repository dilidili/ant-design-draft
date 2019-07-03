module.exports = `import React from 'react';
{{#antdImports}}
{{{antdImports}}}
{{/antdImports}}

const {{{componentType}}} = (props) => {
{{#renderForm.declares}}
{{{.}}}
{{/renderForm.declares}}
{{#renderForm.declareMap}}
{{{.}}}
{{/renderForm.declareMap}}
{{#handlers}}
{{{.}}}
{{/handlers}}
  return (
{{{renderForm.return}}}
  );
};

const Wrapped{{{componentType}}} = Form.create({ name: '{{{componentType}}}' })({{{componentType}}});

export default Wrapped{{{componentType}}};`