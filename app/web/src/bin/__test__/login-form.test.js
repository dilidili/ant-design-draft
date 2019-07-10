const transformSchema = require('../transform');
const path = require('path');
const fs = require('fs');

// import { Form, Icon, Input, Button, Checkbox } from 'antd';

// class NormalLoginForm extends React.Component {
//   handleSubmit = e => {
//     e.preventDefault();
//     this.props.form.validateFields((err, values) => {
//       if (!err) {
//         console.log('Received values of form: ', values);
//       }
//     });
//   };

//   render() {
//     const { getFieldDecorator } = this.props.form;
//     return (
//       <Form onSubmit={this.handleSubmit} className="login-form">
//         <Form.Item>
//           {getFieldDecorator('username', {
//             rules: [{ required: true, message: 'Please input your username!' }],
//           })(
//             <Input
//               prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
//               placeholder="Username"
//             />,
//           )}
//         </Form.Item>
//         <Form.Item>
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
//           {getFieldDecorator('remember', {
//             valuePropName: 'checked',
//             initialValue: true,
//           })(<Checkbox>Remember me</Checkbox>)}
//           <a className="login-form-forgot" href="">
//             Forgot password
//           </a>
//           <Button type="primary" htmlType="submit" className="login-form-button">
//             Log in
//           </Button>
//           Or <a href="">register now!</a>
//         </Form.Item>
//       </Form>
//     );
//   }
// }

// const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);

// ReactDOM.render(<WrappedNormalLoginForm />, mountNode);

const output = `import React from 'react';
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
            <Checkbox>
              Remember me
            </Checkbox>
          )}
          <a className="login-form-forgot" href="">
            Forgot password
          </a>
          <Button type="primary" className="login-form-button" htmlType="submit">
            Log in
          </Button>
          <a href="">
            register now!
          </a>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'NormalLoginForm' })(NormalLoginForm);
export default WrappedNormalLoginForm;`

const hooksOutput = `import React from 'react';
import { Input, Checkbox, Button, Form } from 'antd';

const NormalLoginForm = (props) => {
  const { getFieldDecorator } = props.form;
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  return (
    <Form className="login-form" onSubmit={handleSubmit}>
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
          <Checkbox>
            Remember me
          </Checkbox>
        )}
        <a className="login-form-forgot" href="">
          Forgot password
        </a>
        <Button type="primary" className="login-form-button" htmlType="submit">
          Log in
        </Button>
        <a href="">
          register now!
        </a>
      </Form.Item>
    </Form>
  );
};

const WrappedNormalLoginForm = Form.create({ name: 'NormalLoginForm' })(NormalLoginForm);

export default WrappedNormalLoginForm;`

const schema = {
  name: 'NormalLoginForm',

  form: {
    props: {
      className: 'login-form',
    },
    items: [
      // username
      {
        name: 'username',
        rules: ['required'],
  
        type: 'Input',
        props: {
          placeholder: 'Username',
        }
      },
  
      // password
      {
        name: 'password',
        rules: ['required'],
  
        type: 'Input',
        props: {
          type: 'password',
          placeholder: 'Password',
        },
      },

      // login button and remember me
      [{
        name: 'remember',
        type: 'Checkbox',
        valuePropName: 'checked',
        initialValue: true,
        props: {
          children: 'Remember me',
        },
      }, {
        type: 'a',
        props: {
          className: 'login-form-forgot',
          href: '',
          children: 'Forgot password',
        },
      }, {
        type: 'Button',
        onSubmit: true,
        props: {
          type: 'primary',
          className: 'login-form-button',
          children: 'Log in',
        } 
      }, {
        type: 'a',
        props: {
          children: 'register now!',
          href: '',
        }
      }],
    ],
  },
}

describe('Transform: login form', () => {
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