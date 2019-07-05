import React from 'react';
import { Input, Radio, Form, Button, Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form'

interface CollectionCreateFormProps extends FormComponentProps {
  visible: boolean;
  onCancel: (e: React.MouseEvent<any>) => void;
  onCreate: (e: React.MouseEvent<any>) => void;
}

class CollectionCreateForm extends React.Component<CollectionCreateFormProps> {

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="vertical">
        <Form.Item label="Title">
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'Please input your title!' }],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="Description">
          {getFieldDecorator('description', {
            rules: [{ required: true, message: 'Please input your description!' }],
          })(
            <Input type="textarea" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('modifier', {
            rules: [],
          })(
            <Radio.Group>
              <Radio value="public">
                Public
              </Radio>
              <Radio value="private">
                Private
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
      </Form>
    );
  }

  render() {
    const { visible, onCancel, onCreate, form } = this.props;
    return (
      <Modal visible={visible} onCancel={onCancel} onOk={onCreate} title="title" okText="okText">
        {this.renderForm()}
      </Modal>
    );
  }
}
const CollectionCreateFormContainer = Form.create<CollectionCreateFormProps>({ name: 'CollectionCreateForm' })(CollectionCreateForm);

class CollectionCreateFormButton extends React.Component {
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
          New Collection
        </Button>
        <CollectionCreateFormContainer
          wrappedComponentRef={this.saveFormRef}
          visible={visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}

export default CollectionCreateFormButton;