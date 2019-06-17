import React from 'react';
import { Input, Checkbox, Button, Form } from 'antd';

class NormalLoginForm extends React.Component {

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
      <Form className="login-form" onSubmit={this.handleSubmit}>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input placeholder="Username" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your password!' }],
          })(
            <Input type="password" placeholder="Password" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            rules: [],
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox children="Remember me" />
          )}
          <a className="login-form-forgot" href="" children="Forgot password" />
          <Button type="primary" className="login-form-button" children="Log in" htmlType="submit" />
          <a children="register now!" href="" />
        </Form.Item>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'NormalLoginForm' })(NormalLoginForm);
export default WrappedNormalLoginForm;