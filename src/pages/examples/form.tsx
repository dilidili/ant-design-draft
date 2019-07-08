import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { Input, Radio, Form, Button, Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form'

const CollectionCreateForm = forwardRef((props: FormComponentProps, ref) => {
  useImperativeHandle(ref, () => ({
    form: props.form,
  }));
  const { getFieldDecorator } = props.form;
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
});

const WrappedCollectionCreateForm = Form.create({ name: 'CollectionCreateForm' })(CollectionCreateForm);

interface CollectionCreateFormModalProps {
  visible: boolean;
  onCancel: (e: React.MouseEvent<any>) => void;
  onCreate: (e: React.MouseEvent<any>) => void;
  wrappedComponentRef: any;
}

const CollectionCreateFormModal = (props: CollectionCreateFormModalProps) => {
  const { visible, onCancel, onCreate, wrappedComponentRef } = props;
  return (
    <Modal visible={visible} onCancel={onCancel} onOk={onCreate} title="title" okText="okText">
      <WrappedCollectionCreateForm wrappedComponentRef={wrappedComponentRef} />
    </Modal>
  );
}

const CollectionCreateFormButton = () => {
  const [ visible, setVisible ] = useState(false);
  const inputRef = useRef<FormComponentProps>();

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
        New Collection
      </Button>
      <CollectionCreateFormModal
        wrappedComponentRef={inputRef}
        visible={visible}
        onCancel={() => setVisible(false)}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default CollectionCreateFormButton;