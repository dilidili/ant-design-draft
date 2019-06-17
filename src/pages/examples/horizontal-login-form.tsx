import React from 'react';
import { Input, Button, Form } from 'antd';

class HorizontalLoginForm extends React.Component {

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="inline" onSubmit={this.handleSubmit}>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }]
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your password!' }]
          })(
            <Input type="password" />
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" children="Log in" htmlType="submit" />
        </Form.Item>
      </Form>
    );
  }
}

const WrappedHorizontalLoginForm = Form.create({ name: 'HorizontalLoginForm' })(HorizontalLoginForm);
export default WrappedHorizontalLoginForm;