import React from 'react';
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
export default WrappedConfigForm;