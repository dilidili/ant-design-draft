import React from 'react';
import { Form } from 'antd';

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
      <Form className="login-form" labelCol={formLabelColProp} wrapperCol={formWrapperColProp} />
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: 'RegistrationForm' })(RegistrationForm);
export default WrappedRegistrationForm;