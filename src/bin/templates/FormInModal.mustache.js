module.exports = `import React from 'react';
{{#antdImports}}
{{{antdImports}}}
{{/antdImports}}

class {{{componentType}}} extends React.Component {
{{#handlers}}
{{{.}}}
{{/handlers}}

  renderForm() {
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

  render() {
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
}
const {{{componentType}}}Container = Form.create({ name: '{{{componentType}}}' })({{{componentType}}});

class {{{componentType}}}Button extends React.Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', values);
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const { visible } = this.state;

    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          {{{render.buttonLabel}}}
        </Button>
        <{{{componentType}}}Container
          wrappedComponentRef={this.saveFormRef}
          visible={visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}

export default {{{componentType}}}Button;`