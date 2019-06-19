import React from 'react';
import { Input, Cascader, AutoComplete, Col, Button, Row, Checkbox, Form } from 'antd';

class RegistrationForm extends React.Component {

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    console.warn('TODO: implement validateToNextPassword');
    callback();
  };


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
    const formItemWrapperColProp = {
      "xs": {
        "span": 24,
        "offset": 0
      },
      "sm": {
        "span": 16,
        "offset": 8
      }
    };
    return (
      <Form className="login-form" labelCol={formLabelColProp} wrapperCol={formWrapperColProp} onSubmit={this.handleSubmit}>
        <Form.Item label="E-mail">
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'The input is not valid E-mail!' }],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="Password">
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your password!' }, { validator: this.validateToNextPassword }],
          })(
            <Input.Password />
          )}
        </Form.Item>
        <Form.Item label="Confirm Password">
          {getFieldDecorator('confirm', {
            rules: [{ required: true, message: 'Please input your confirm!' }],
          })(
            <Input.Password />
          )}
        </Form.Item>
        <Form.Item label="Nickname">
          {getFieldDecorator('nickname', {
            rules: [{ required: true, message: 'Please input your nickname!' }],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="Habitual Residence">
          {getFieldDecorator('residence', {
            rules: [{ required: true, message: 'Please input your residence!' }],
            initialValue: ["zhejiang","hangzhou","xihu"],
          })(
            <Cascader options={[]} />
          )}
        </Form.Item>
        <Form.Item label="Website">
          {getFieldDecorator('website', {
            rules: [{ required: true, message: 'Please input your website!' }],
          })(
            <AutoComplete placeholder="website" dataSource={[]}>
              <Input />
            </AutoComplete>
          )}
        </Form.Item>
        <Form.Item label="Captcha" extra="We must make sure that your are a human.">
          <Row gutter={8}>
            <Col span={12}>
              {getFieldDecorator('captcha', {
                rules: [{ required: true, message: 'Please input your captcha!' }],
              })(
                <Input />
              )}
            </Col>
            <Col span={12}>
              <Button>
                Get captcha
              </Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item wrapperCol={formItemWrapperColProp}>
          {getFieldDecorator('agreement', {
            rules: [],
            valuePropName: 'checked',
          })(
            <Checkbox>
              I have read the agreement
            </Checkbox>
          )}
        </Form.Item>
        <Form.Item wrapperCol={formItemWrapperColProp}>
          <Button htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedRegistrationForm = Form.create({ name: 'RegistrationForm' })(RegistrationForm);
export default WrappedRegistrationForm;