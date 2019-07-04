const transformSchema = require('../transform');
const path = require('path');
const fs = require('fs');

const output = `import React from 'react';
import { Row, Col, Input, Form } from 'antd';

class ConfigForm extends React.Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="CE 版本">
              {getFieldDecorator('CEVersion', {
                rules: [],
              })(
                <Input />
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="JDK 版本">
              {getFieldDecorator('JDKVersion', {
                rules: [],
              })(
                <Input />
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

const WrappedConfigForm = Form.create({ name: 'ConfigForm' })(ConfigForm);
export default WrappedConfigForm;`;

const hooksOutput = `import React from 'react';
import { Row, Col, Input, Form } from 'antd';

const ConfigForm = (props) => {
  const { getFieldDecorator } = props.form;
  return (
    <Form>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item label="CE 版本">
            {getFieldDecorator('CEVersion', {
              rules: [],
            })(
              <Input />
            )}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="JDK 版本">
            {getFieldDecorator('JDKVersion', {
              rules: [],
            })(
              <Input />
            )}
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

const WrappedConfigForm = Form.create({ name: 'ConfigForm' })(ConfigForm);

export default WrappedConfigForm;`

const schema = {
  name: 'ConfigForm',

  form: {
    items: [{
      type: 'Row',
      props: {
        gutter: 24,
      },
      layout: [12, 12],
      items: [{
        type: 'Input',
        name: 'CEVersion',
        label: 'CE 版本',
      }, {
        type: 'Input',
        name: 'JDKVersion',
        label: 'JDK 版本',
      }],
    }],
  },
}

describe('Transform: form in modal', () => {
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