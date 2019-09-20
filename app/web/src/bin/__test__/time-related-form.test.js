const transformSchema = require('../transform').default;
const path = require('path');
const fs = require('fs');

// import { Form, DatePicker, TimePicker, Button } from 'antd';

// const { MonthPicker, RangePicker } = DatePicker;

// class TimeRelatedForm extends React.Component {
//   handleSubmit = e => {
//     e.preventDefault();

//     this.props.form.validateFields((err, fieldsValue) => {
//       if (err) {
//         return;
//       }

//       // Should format date value before submit.
//       const rangeValue = fieldsValue['range-picker'];
//       const rangeTimeValue = fieldsValue['range-time-picker'];
//       const values = {
//         ...fieldsValue,
//         'date-picker': fieldsValue['date-picker'].format('YYYY-MM-DD'),
//         'date-time-picker': fieldsValue['date-time-picker'].format('YYYY-MM-DD HH:mm:ss'),
//         'month-picker': fieldsValue['month-picker'].format('YYYY-MM'),
//         'range-picker': [rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')],
//         'range-time-picker': [
//           rangeTimeValue[0].format('YYYY-MM-DD HH:mm:ss'),
//           rangeTimeValue[1].format('YYYY-MM-DD HH:mm:ss'),
//         ],
//         'time-picker': fieldsValue['time-picker'].format('HH:mm:ss'),
//       };
//       console.log('Received values of form: ', values);
//     });
//   };

//   render() {
//     const { getFieldDecorator } = this.props.form;
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
//     const config = {
//       rules: [{ type: 'object', required: true, message: 'Please select time!' }],
//     };
//     const rangeConfig = {
//       rules: [{ type: 'array', required: true, message: 'Please select time!' }],
//     };
//     return (
//       <Form {...formItemLayout} onSubmit={this.handleSubmit}>
//         <Form.Item label="DatePicker">
//           {getFieldDecorator('date-picker', config)(<DatePicker />)}
//         </Form.Item>
//         <Form.Item label="DatePicker[showTime]">
//           {getFieldDecorator('date-time-picker', config)(
//             <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
//           )}
//         </Form.Item>
//         <Form.Item label="MonthPicker">
//           {getFieldDecorator('month-picker', config)(<MonthPicker />)}
//         </Form.Item>
//         <Form.Item label="RangePicker">
//           {getFieldDecorator('range-picker', rangeConfig)(<RangePicker />)}
//         </Form.Item>
//         <Form.Item label="RangePicker[showTime]">
//           {getFieldDecorator('range-time-picker', rangeConfig)(
//             <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />,
//           )}
//         </Form.Item>
//         <Form.Item label="TimePicker">
//           {getFieldDecorator('time-picker', config)(<TimePicker />)}
//         </Form.Item>
//         <Form.Item
//           wrapperCol={{
//             xs: { span: 24, offset: 0 },
//             sm: { span: 16, offset: 8 },
//           }}
//         >
//           <Button type="primary" htmlType="submit">
//             Submit
//           </Button>
//         </Form.Item>
//       </Form>
//     );
//   }
// }

// const WrappedTimeRelatedForm = Form.create({ name: 'time_related_controls' })(TimeRelatedForm);

// ReactDOM.render(<WrappedTimeRelatedForm />, mountNode);

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

const schema = {
  name: 'TimeRelatedForm',

  form: {
    items: [{
      name: 'date-picker',
      label: 'DatePicker',
      type: 'DatePicker',
      rules: ['required'],
    }, {
      name: 'date-time-picker',
      label: 'DatePicker[showTime]',
      type: 'DatePicker',
      rules: ['required'],
      props: {
        showTime: true,
        format: "YYYY-MM-DD HH:mm:ss",
      }
    }, {
      name: 'month-picker',
      label: 'MonthPicker',
      type: 'DatePicker.MonthPicker',
      rules: ['required'],
    }, {
      name: 'range-picker',
      label: 'RangePicker',
      type: 'DatePicker.RangePicker',
      rules: ['required'],
    }, {
      name: 'range-time-picker',
      label: 'RangePicker[showTime]',
      type: 'DatePicker.RangePicker',
      rules: ['required'],
      props: {
        showTime: true,
        format: "YYYY-MM-DD HH:mm:ss",
      }
    }, {
      name: 'time-picker',
      label: 'TimePicker',
      type: 'TimePicker',
      rules: ['required'],
    }, {
      type: 'Button',
      props: {
        type: "primary",
        children: 'Submit',
      },
      onSubmit: true,
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 16, offset: 8 },
      }
    }],

    props: {
      ...formItemLayout,
    }
  },
}

const output = `import React from 'react';
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
export default WrappedTimeRelatedForm;`

const hooksOutput = `import React from 'react';
import { DatePicker, TimePicker, Button, Form } from 'antd';

const TimeRelatedForm = (props) => {
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
  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  return (
    <Form labelCol={formLabelColProp} wrapperCol={formWrapperColProp} onSubmit={handleSubmit}>
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
};

const WrappedTimeRelatedForm = Form.create({ name: 'TimeRelatedForm' })(TimeRelatedForm);

export default WrappedTimeRelatedForm;`;

describe('Transform: time related form', () => {
  it('transform correctly', () => {
    const content = transformSchema(schema);

    expect(content).toEqual(output);
    // fs.writeFileSync(path.join(__dirname, '../../pages/examples/form.tsx'), content, 'utf8');
  });

  it(`transform in hooks mode`, () => {
    const content = transformSchema(schema, { reactApi: 'Hooks' });

    expect(content).toEqual(hooksOutput);
    // fs.writeFileSync(path.join(__dirname, '../../pages/examples/form.tsx'), content, 'utf8');
  });
});