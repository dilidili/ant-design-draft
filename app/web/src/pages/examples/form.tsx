import React from 'react';
import { Input, Form } from 'antd';
import { FormComponentProps } from 'antd/lib/form/Form'

const DefaultForm = (props: FormComponentProps) => {
  const { getFieldDecorator } = props.form;
  const formLabelColProp = {
    "span": 4
  };
  const formWrapperColProp = {
    "span": 14
  };
  return (
    <Form labelCol={formLabelColProp} wrapperCol={formWrapperColProp}>
      <Form.Item label="E-mail">
        {getFieldDecorator('email', {
          rules: [{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'The input is not valid E-mail!' }],
        })(
          <Input />
        )}
      </Form.Item>
    </Form>
  );
};

const WrappedDefaultForm = Form.create({ name: 'DefaultForm' })(DefaultForm);

export default WrappedDefaultForm;