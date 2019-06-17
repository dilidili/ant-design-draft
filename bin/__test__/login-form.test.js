const transformSchema = require('../transform');
const path = require('path');
const fs = require('fs');

const output = `import { Form, Icon, Input, Button, Checkbox } from 'antd';

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
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input your username!' }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input your Password!' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />,
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(<Checkbox>Remember me</Checkbox>)}
          <a className="login-form-forgot" href="">
            Forgot password
          </a>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or <a href="">register now!</a>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(NormalLoginForm);

ReactDOM.render(<WrappedNormalLoginForm />, mountNode);`

const schema = {
  componentType: 'NormalLoginForm',

  form: {
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
  });
});