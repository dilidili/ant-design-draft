import React from 'react';
import { Input, Form } from 'antd';

class RegistrationForm extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    const formLabelColProp = {
      "xs": {
        "span": 24
      },
      "sm": {
        "span": 8
      }
    };
    const formWrapperColProp = {
      "xs": {
        "span": 24
      },
      "sm": {
        "span": 16
      }
    };
    return (
      <Form className="login-form" labelCol={formLabelColProp} wrapperCol={formWrapperColProp}>
        <Form.Item label="E-mail">
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'The input is not valid E-mail!' }],
          })(
            <Input />
          )}
        </Form.Item>
      </Form>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: 'RegistrationForm' })(RegistrationForm);
export default WrappedRegistrationForm;