import React from 'react';
import { DatePicker, TimePicker, Button, Form } from 'antd';

class TimeRelatedForm extends React.Component {

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
      <Form labelCol={formLabelColProp} wrapperCol={formWrapperColProp} onSubmit={this.handleSubmit}>
        <Form.Item label="DatePicker">
          {getFieldDecorator('date-picker', {
            rules: [{ required: true, message: 'Please input your date-picker!' }],
          })(
            <DatePicker />
          )}
        </Form.Item>
        <Form.Item label="DatePicker[showTime]">
          {getFieldDecorator('date-time-picker', {
            rules: [{ required: true, message: 'Please input your date-time-picker!' }],
          })(
            <DatePicker showTime={true} format="YYYY-MM-DD HH:mm:ss" />
          )}
        </Form.Item>
        <Form.Item label="MonthPicker">
          {getFieldDecorator('month-picker', {
            rules: [{ required: true, message: 'Please input your month-picker!' }],
          })(
            <DatePicker.MonthPicker />
          )}
        </Form.Item>
        <Form.Item label="RangePicker">
          {getFieldDecorator('range-picker', {
            rules: [{ required: true, message: 'Please input your range-picker!' }],
          })(
            <DatePicker.RangePicker />
          )}
        </Form.Item>
        <Form.Item label="RangePicker[showTime]">
          {getFieldDecorator('range-time-picker', {
            rules: [{ required: true, message: 'Please input your range-time-picker!' }],
          })(
            <DatePicker.RangePicker showTime={true} format="YYYY-MM-DD HH:mm:ss" />
          )}
        </Form.Item>
        <Form.Item label="TimePicker">
          {getFieldDecorator('time-picker', {
            rules: [{ required: true, message: 'Please input your time-picker!' }],
          })(
            <TimePicker />
          )}
        </Form.Item>
        <Form.Item wrapperCol={formItemWrapperColProp}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

const WrappedTimeRelatedForm = Form.create({ name: 'TimeRelatedForm' })(TimeRelatedForm);
export default WrappedTimeRelatedForm;