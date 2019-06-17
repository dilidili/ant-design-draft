const transformSchema = require('../transform');
const path = require('path');
const fs = require('fs');

// import { Form, Icon, Input, Button } from 'antd';

// function hasErrors(fieldsError) {
//   return Object.keys(fieldsError).some(field => fieldsError[field]);
// }

// class HorizontalLoginForm extends React.Component {
//   componentDidMount() {
//     // To disabled submit button at the beginning.
//     this.props.form.validateFields();
//   }

//   handleSubmit = e => {
//     e.preventDefault();
//     this.props.form.validateFields((err, values) => {
//       if (!err) {
//         console.log('Received values of form: ', values);
//       }
//     });
//   };

//   render() {
//     const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

//     // Only show error after a field is touched.
//     const usernameError = isFieldTouched('username') && getFieldError('username');
//     const passwordError = isFieldTouched('password') && getFieldError('password');
//     return (
//       <Form layout="inline" onSubmit={this.handleSubmit}>
//         <Form.Item validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}>
//           {getFieldDecorator('username', {
//             rules: [{ required: true, message: 'Please input your username!' }],
//           })(
//             <Input
//               prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
//               placeholder="Username"
//             />,
//           )}
//         </Form.Item>
//         <Form.Item validateStatus={passwordError ? 'error' : ''} help={passwordError || ''}>
//           {getFieldDecorator('password', {
//             rules: [{ required: true, message: 'Please input your Password!' }],
//           })(
//             <Input
//               prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
//               type="password"
//               placeholder="Password"
//             />,
//           )}
//         </Form.Item>
//         <Form.Item>
//           <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
//             Log in
//           </Button>
//         </Form.Item>
//       </Form>
//     );
//   }
// }

// const WrappedHorizontalLoginForm = Form.create({ name: 'horizontal_login' })(HorizontalLoginForm);

// ReactDOM.render(<WrappedHorizontalLoginForm />, mountNode);

const output = `import React from 'react';
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
          <Button type="primary" children="Log in" htmlType="submit" />
        </Form.Item>
      </Form>
    );
  }
}

const WrappedHorizontalLoginForm = Form.create({ name: 'HorizontalLoginForm' })(HorizontalLoginForm);
export default WrappedHorizontalLoginForm;`

const schema = {
  componentType: 'HorizontalLoginForm',

  form: {
    props: {
      layout: 'inline',
    },

    items: [
      // username
      {
        name: 'username',
        rules: ['required'],
  
        type: 'Input',
      },
  
      // password
      {
        name: 'password',
        rules: ['required'],
  
        type: 'Input',
        props: {
          type: 'password',
        },
      },

      // login button
      {
        type: 'Button',
        onSubmit: true,
        props: {
          type: 'primary',
          children: 'Log in',
        } 
      },
    ],
  },
}

describe('Transform: horizontal login form', () => {
  it('transform correctly', () => {
    const content = transformSchema(schema);

    fs.writeFileSync(path.join(__dirname, '../../src/pages/examples/horizontal-login-form.tsx'), content, 'utf8');
    expect(content).toEqual(output);
  });
});