module.exports = `import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
{{#antdImports}}
{{{antdImports}}}
{{/antdImports}}

const {{{componentType}}} = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    form: props.form,
  }));
{{#renderForm.declares}}
{{{.}}}
{{/renderForm.declares}}
{{#renderForm.declareMap}}
{{{.}}}
{{/renderForm.declareMap}}
  return (
{{{renderForm.return}}}
  );
});

const Wrapped{{{componentType}}} = Form.create({ name: '{{{componentType}}}' })({{{componentType}}});

const {{{componentType}}}Modal = (props) => {
{{#handlers}}
{{{.}}}
{{/handlers}}
{{#render.declares}}
{{{.}}}
{{/render.declares}}
{{#render.declareMap}}
{{{.}}}
{{/render.declareMap}}
  return (
{{{render.return}}}
  );
}

const {{{componentType}}}Button = (props) => {
  const [ visible, setVisible ] = useState(false);
  const inputRef = useRef();

  const handleCreate = () => {
    if (!inputRef.current) return;

    const form = inputRef.current.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', values);
      form.resetFields();
      setVisible(false);
    });
  };

  return (
    <div>
      <Button type="primary" onClick={() => setVisible(true)}>
        {{{render.buttonLabel}}}
      </Button>
      <{{{componentType}}}Modal
        wrappedComponentRef={inputRef}
        visible={visible}
        onCancel={() => setVisible(false)}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default {{{componentType}}}Button;`