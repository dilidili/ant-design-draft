import React from 'react';
import { Input, Button, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form'

const HorizontalLoginForm = (props: FormComponentProps) => {
  const { getFieldDecorator } = props.form;
  const handleSubmit = (e: React.MouseEvent<any>) => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  return (
    <Form layout="inline" onSubmit={handleSubmit}>
      <Form.Item>
        {getFieldDecorator('username', {
          rules: [{ required: true, message: 'Please input your username!' }],
        })(
          <Input />
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: 'Please input your password!' }],
        })(
          <Input type="password" />
        )}
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Log in
        </Button>
      </Form.Item>
    </Form>
  );
};

const WrappedHorizontalLoginForm = Form.create({ name: 'HorizontalLoginForm' })(HorizontalLoginForm);

export default WrappedHorizontalLoginForm;