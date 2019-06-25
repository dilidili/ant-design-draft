module.exports = `const React = window.React;
{{#antdImports}}
{{{antdImports}}}
{{/antdImports}}

class {{{componentType}}} extends React.Component {
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

Wrapped{{{componentType}}};`