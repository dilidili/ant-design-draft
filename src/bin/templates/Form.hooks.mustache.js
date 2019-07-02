module.exports = `const React = window.React;
{{#antdImports}}
{{{antdImports}}}
{{/antdImports}}

const {{{componentType}}} = (props) => {
{{#handlers}}
{{{.}}}
{{/handlers}}
  return (
{{{renderForm.return}}}
  );
};

const Wrapped{{{componentType}}} = Form.create({ name: '{{{componentType}}}' })({{{componentType}}});

Wrapped{{{componentType}}};`