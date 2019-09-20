const transformSchema = require('../transform').default;
const path = require('path');
const fs = require('fs');

// import {
//   Form,
//   Input,
//   Tooltip,
//   Icon,
//   Cascader,
//   Select,
//   Row,
//   Col,
//   Checkbox,
//   Button,
//   AutoComplete,
// } from 'antd';

// const { Option } = Select;
// const AutoCompleteOption = AutoComplete.Option;

// const residences = [
//   {
//     value: 'zhejiang',
//     label: 'Zhejiang',
//     children: [
//       {
//         value: 'hangzhou',
//         label: 'Hangzhou',
//         children: [
//           {
//             value: 'xihu',
//             label: 'West Lake',
//           },
//         ],
//       },
//     ],
//   },
//   {
//     value: 'jiangsu',
//     label: 'Jiangsu',
//     children: [
//       {
//         value: 'nanjing',
//         label: 'Nanjing',
//         children: [
//           {
//             value: 'zhonghuamen',
//             label: 'Zhong Hua Men',
//           },
//         ],
//       },
//     ],
//   },
// ];

// class RegistrationForm extends React.Component {
//   state = {
//     confirmDirty: false,
//     autoCompleteResult: [],
//   };

//   handleSubmit = e => {
//     e.preventDefault();
//     this.props.form.validateFieldsAndScroll((err, values) => {
//       if (!err) {
//         console.log('Received values of form: ', values);
//       }
//     });
//   };

//   handleConfirmBlur = e => {
//     const value = e.target.value;
//     this.setState({ confirmDirty: this.state.confirmDirty || !!value });
//   };

//   compareToFirstPassword = (rule, value, callback) => {
//     const form = this.props.form;
//     if (value && value !== form.getFieldValue('password')) {
//       callback('Two passwords that you enter is inconsistent!');
//     } else {
//       callback();
//     }
//   };

//   validateToNextPassword = (rule, value, callback) => {
//     const form = this.props.form;
//     if (value && this.state.confirmDirty) {
//       form.validateFields(['confirm'], { force: true });
//     }
//     callback();
//   };

//   handleWebsiteChange = value => {
//     let autoCompleteResult;
//     if (!value) {
//       autoCompleteResult = [];
//     } else {
//       autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`);
//     }
//     this.setState({ autoCompleteResult });
//   };

//   render() {
//     const { getFieldDecorator } = this.props.form;
//     const { autoCompleteResult } = this.state;

//     const formItemLayout = {
//       labelCol: {
//         xs: { span: 24 },
//         sm: { span: 8 },
//       },
//       wrapperCol: {
//         xs: { span: 24 },
//         sm: { span: 16 },
//       },
//     };
//     const tailFormItemLayout = {
//       wrapperCol: {
//         xs: {
//           span: 24,
//           offset: 0,
//         },
//         sm: {
//           span: 16,
//           offset: 8,
//         },
//       },
//     };
//     const prefixSelector = getFieldDecorator('prefix', {
//       initialValue: '86',
//     })(
//       <Select style={{ width: 70 }}>
//         <Option value="86">+86</Option>
//         <Option value="87">+87</Option>
//       </Select>,
//     );

//     const websiteOptions = autoCompleteResult.map(website => (
//       <AutoCompleteOption key={website}>{website}</AutoCompleteOption>
//     ));

//     return (
//       <Form {...formItemLayout} onSubmit={this.handleSubmit}>
//         <Form.Item label="E-mail">
//           {getFieldDecorator('email', {
//             rules: [
//               {
//                 type: 'email',
//                 message: 'The input is not valid E-mail!',
//               },
//               {
//                 required: true,
//                 message: 'Please input your E-mail!',
//               },
//             ],
//           })(<Input />)}
//         </Form.Item>
//         <Form.Item label="Password" hasFeedback>
//           {getFieldDecorator('password', {
//             rules: [
//               {
//                 required: true,
//                 message: 'Please input your password!',
//               },
//               {
//                 validator: this.validateToNextPassword,
//               },
//             ],
//           })(<Input.Password />)}
//         </Form.Item>
//         <Form.Item label="Confirm Password" hasFeedback>
//           {getFieldDecorator('confirm', {
//             rules: [
//               {
//                 required: true,
//                 message: 'Please confirm your password!',
//               },
//               {
//                 validator: this.compareToFirstPassword,
//               },
//             ],
//           })(<Input.Password onBlur={this.handleConfirmBlur} />)}
//         </Form.Item>
//         <Form.Item
//           label={
//             <span>
//               Nickname&nbsp;
//               <Tooltip title="What do you want others to call you?">
//                 <Icon type="question-circle-o" />
//               </Tooltip>
//             </span>
//           }
//         >
//           {getFieldDecorator('nickname', {
//             rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
//           })(<Input />)}
//         </Form.Item>
//         <Form.Item label="Habitual Residence">
//           {getFieldDecorator('residence', {
//             initialValue: ['zhejiang', 'hangzhou', 'xihu'],
//             rules: [
//               { type: 'array', required: true, message: 'Please select your habitual residence!' },
//             ],
//           })(<Cascader options={residences} />)}
//         </Form.Item>
//         <Form.Item label="Phone Number">
//           {getFieldDecorator('phone', {
//             rules: [{ required: true, message: 'Please input your phone number!' }],
//           })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
//         </Form.Item>
//         <Form.Item label="Website">
//           {getFieldDecorator('website', {
//             rules: [{ required: true, message: 'Please input website!' }],
//           })(
//             <AutoComplete
//               dataSource={websiteOptions}
//               onChange={this.handleWebsiteChange}
//               placeholder="website"
//             >
//               <Input />
//             </AutoComplete>,
//           )}
//         </Form.Item>
//         <Form.Item label="Captcha" extra="We must make sure that your are a human.">
//           <Row gutter={8}>
//             <Col span={12}>
//               {getFieldDecorator('captcha', {
//                 rules: [{ required: true, message: 'Please input the captcha you got!' }],
//               })(<Input />)}
//             </Col>
//             <Col span={12}>
//               <Button>Get captcha</Button>
//             </Col>
//           </Row>
//         </Form.Item>
//         <Form.Item {...tailFormItemLayout}>
//           {getFieldDecorator('agreement', {
//             valuePropName: 'checked',
//           })(
//             <Checkbox>
//               I have read the <a href="">agreement</a>
//             </Checkbox>,
//           )}
//         </Form.Item>
//         <Form.Item {...tailFormItemLayout}>
//           <Button type="primary" htmlType="submit">
//             Register
//           </Button>
//         </Form.Item>
//       </Form>
//     );
//   }
// }

// const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm);

// ReactDOM.render(<WrappedRegistrationForm />, mountNode);

const output = `import React from 'react';
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
        <Form.Item label="E-mail" hasFeedback={true}>
          {getFieldDecorator('email', {
            rules: [{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'The input is not valid E-mail!' }],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="Password" hasFeedback={true}>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your password!' }, { validator: this.validateToNextPassword }],
          })(
            <Input.Password />
          )}
        </Form.Item>
        <Form.Item label="Confirm Password" hasFeedback={true}>
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
export default WrappedRegistrationForm;`;

const hooksOutput = `import React from 'react';
import { Input, Cascader, AutoComplete, Col, Button, Row, Checkbox, Form } from 'antd';

const RegistrationForm = (props) => {
  const { getFieldDecorator } = props.form;
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

  const validateToNextPassword = (rule, value, callback) => {
    const form = props.form;
    console.warn('TODO: implement validateToNextPassword');
    callback();
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  return (
    <Form className="login-form" labelCol={formLabelColProp} wrapperCol={formWrapperColProp} onSubmit={handleSubmit}>
      <Form.Item label="E-mail" hasFeedback={true}>
        {getFieldDecorator('email', {
          rules: [{ required: true, message: 'Please input your email!' }, { type: 'email', message: 'The input is not valid E-mail!' }],
        })(
          <Input />
        )}
      </Form.Item>
      <Form.Item label="Password" hasFeedback={true}>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: 'Please input your password!' }, { validator: validateToNextPassword }],
        })(
          <Input.Password />
        )}
      </Form.Item>
      <Form.Item label="Confirm Password" hasFeedback={true}>
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
};

const WrappedRegistrationForm = Form.create({ name: 'RegistrationForm' })(RegistrationForm);

export default WrappedRegistrationForm;`;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const schema = {
  name: 'RegistrationForm',

  form: {
    props: {
      className: 'login-form',
      ...formItemLayout,
    },
    items: [{
      name: 'email',
      label: 'E-mail',
      hasFeedback: true,
      type: 'Input',
      rules: ['required', 'email'],
    }, {
      name: 'password',
      label: 'Password',
      hasFeedback: true,
      type: 'Input.Password',
      rules: ['required'],
      validators: ['validateToNextPassword'],
    }, {
      name: 'confirm',
      label: 'Confirm Password',
      hasFeedback: true,
      rules: ['required'],
      validator: ['compareToFirstPassword'],
      type: 'Input.Password',
    }, {
      name: 'nickname',
      label: 'Nickname',
      rules: ['required'],
      type: 'Input',
    }, {
      name: 'residence',
      label: 'Habitual Residence',
      initialValue: ['zhejiang', 'hangzhou', 'xihu'],
      rules: ['array', 'required'],
      type: 'Cascader',
    }, {
      name: 'website',
      label: 'Website',
      rules: ['required'],
      type: 'AutoComplete',
      props: {
        placeholder: "website",
        dataSource: [],
        children: [{
          type: 'Input',
        }]
      }
    }, [{
      label: 'Captcha',
      extra: "We must make sure that your are a human.",
      gutter: 8,
      name: 'captcha',
      type: 'Input',
      rules: ['required'],
      span: 12,
    }, {
      type: 'Button',
      span: 12,
      props: {
        children: 'Get captcha',
      }
    }], {
      name: 'agreement',
      type: 'Checkbox',
      valuePropName: 'checked',
      props: {
        children: 'I have read the agreement',
      },
      ...tailFormItemLayout,
    }, {
      type: 'Button',
      onSubmit: true,
      props: {
        children: 'Submit',
      },
      ...tailFormItemLayout,
    }]
  },
}

describe('Transform: registration form', () => {
  it('transform correctly', () => {
    const content = transformSchema(schema);

    expect(content).toEqual(output);
    // fs.writeFileSync(path.join(__dirname, '../../pages/examples/form.tsx'), content, 'utf8');
  });

  it(`transform in hooks mode`, () => {
    const content = transformSchema(schema, { reactApi: 'Hooks' });

    expect(content).toEqual(hooksOutput);
    // fs.writeFileSync(path.join(__dirname, '../../pages/examples/form.tsx'), content, 'utf8');
  })
});