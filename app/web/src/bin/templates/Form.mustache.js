module.exports = `import React from 'react';
{{#antdImports}}
{{{antdImports}}}
{{/antdImports}}

{{#formTsWrapper}}class {{{componentType}}} extends React.Component{{/formTsWrapper}} {
{{#handlers}}
{{{.}}}
{{/handlers}}
  render() {
{{#renderForm.declares}}
{{{.}}}
{{/renderForm.declares}}
{{#renderForm.declareMap}}
{{{.}}}
{{/renderForm.declareMap}}
    return (
{{{renderForm.return}}}
    );
  }
}

const Wrapped{{{componentType}}} = Form.create({ name: '{{{componentType}}}' })({{{componentType}}});
export default Wrapped{{{componentType}}};`