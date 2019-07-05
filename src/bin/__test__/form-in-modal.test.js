const transformSchema = require('../transform');
const path = require('path');
const fs = require('fs');

// import { Button, Modal, Form, Input, Radio } from 'antd';

// const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
//   // eslint-disable-next-line
//   class extends React.Component {
//     render() {
//       const { visible, onCancel, onCreate, form } = this.props;
//       const { getFieldDecorator } = form;
//       return (
//         <Modal
//           visible={visible}
//           title="Create a new collection"
//           okText="Create"
//           onCancel={onCancel}
//           onOk={onCreate}
//         >
//           <Form layout="vertical">
//             <Form.Item label="Title">
//               {getFieldDecorator('title', {
//                 rules: [{ required: true, message: 'Please input the title of collection!' }],
//               })(<Input />)}
//             </Form.Item>
//             <Form.Item label="Description">
//               {getFieldDecorator('description')(<Input type="textarea" />)}
//             </Form.Item>
//             <Form.Item className="collection-create-form_last-form-item">
//               {getFieldDecorator('modifier', {
//                 initialValue: 'public',
//               })(
//                 <Radio.Group>
//                   <Radio value="public">Public</Radio>
//                   <Radio value="private">Private</Radio>
//                 </Radio.Group>,
//               )}
//             </Form.Item>
//           </Form>
//         </Modal>
//       );
//     }
//   },
// );

// class CollectionsPage extends React.Component {
//   state = {
//     visible: false,
//   };

//   showModal = () => {
//     this.setState({ visible: true });
//   };

//   handleCancel = () => {
//     this.setState({ visible: false });
//   };

//   handleCreate = () => {
//     const form = this.formRef.props.form;
//     form.validateFields((err, values) => {
//       if (err) {
//         return;
//       }

//       console.log('Received values of form: ', values);
//       form.resetFields();
//       this.setState({ visible: false });
//     });
//   };

//   saveFormRef = formRef => {
//     this.formRef = formRef;
//   };

//   render() {
//     return (
//       <div>
//         <Button type="primary" onClick={this.showModal}>
//           New Collection
//         </Button>
//         <CollectionCreateForm
//           wrappedComponentRef={this.saveFormRef}
//           visible={this.state.visible}
//           onCancel={this.handleCancel}
//           onCreate={this.handleCreate}
//         />
//       </div>
//     );
//   }
// }

// ReactDOM.render(<CollectionsPage />, mountNode);

const output = `import React from 'react';
import { Input, Radio, Form, Button, Modal } from 'antd';

class CollectionCreateForm extends React.Component {

  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="vertical">
        <Form.Item label="Title">
          {getFieldDecorator('title', {
            rules: [{ required: true, message: 'Please input your title!' }],
          })(
            <Input />
          )}
        </Form.Item>
        <Form.Item label="Description">
          {getFieldDecorator('description', {
            rules: [{ required: true, message: 'Please input your description!' }],
          })(
            <Input type="textarea" />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('modifier', {
            rules: [],
          })(
            <Radio.Group>
              <Radio value="public">
                Public
              </Radio>
              <Radio value="private">
                Private
              </Radio>
            </Radio.Group>
          )}
        </Form.Item>
      </Form>
    );
  }

  render() {
    const { visible, onCancel, onCreate, form } = this.props;
    return (
      <Modal visible={visible} onCancel={onCancel} onOk={onCreate} title="title" okText="okText">
        {this.renderForm()}
      </Modal>
    );
  }
}
const CollectionCreateFormContainer = Form.create({ name: 'CollectionCreateForm' })(CollectionCreateForm);

class CollectionCreateFormButton extends React.Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', values);
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const { visible } = this.state;

    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          New Collection
        </Button>
        <CollectionCreateFormContainer
          wrappedComponentRef={this.saveFormRef}
          visible={visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}

export default CollectionCreateFormButton;`;

const hooksOutput = `import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { Input, Radio, Form, Button, Modal } from 'antd';

const CollectionCreateForm = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => ({
    form: props.form,
  }));
  const { getFieldDecorator } = props.form;
  return (
    <Form layout="vertical">
      <Form.Item label="Title">
        {getFieldDecorator('title', {
          rules: [{ required: true, message: 'Please input your title!' }],
        })(
          <Input />
        )}
      </Form.Item>
      <Form.Item label="Description">
        {getFieldDecorator('description', {
          rules: [{ required: true, message: 'Please input your description!' }],
        })(
          <Input type="textarea" />
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('modifier', {
          rules: [],
        })(
          <Radio.Group>
            <Radio value="public">
              Public
            </Radio>
            <Radio value="private">
              Private
            </Radio>
          </Radio.Group>
        )}
      </Form.Item>
    </Form>
  );
});

const WrappedCollectionCreateForm = Form.create({ name: 'CollectionCreateForm' })(CollectionCreateForm);

const CollectionCreateFormModal = (props) => {
  const { visible, onCancel, onCreate, wrappedComponentRef } = props;
  return (
    <Modal visible={visible} onCancel={onCancel} onOk={onCreate} title="title" okText="okText">
      <WrappedCollectionCreateForm wrappedComponentRef={wrappedComponentRef} />
    </Modal>
  );
}

const CollectionCreateFormButton = (props) => {
  const [ visible, setVisible ] = useState(false);
  const inputRef = useRef();

  const handleCreate = () => {
    if (!inputRef.current) return;

    const form = inputRef.current.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      console.log('Received values of form: ', values);
      form.resetFields();
      setVisible(false);
    });
  };

  return (
    <div>
      <Button type="primary" onClick={() => setVisible(true)}>
        New Collection
      </Button>
      <CollectionCreateFormModal
        wrappedComponentRef={inputRef}
        visible={visible}
        onCancel={() => setVisible(false)}
        onCreate={handleCreate}
      />
    </div>
  );
};

export default CollectionCreateFormButton;`

const schema = {
  name: 'CollectionCreateForm',

  formInModal: {
    form: {
      props: {
        layout: "vertical",
      },
      items: [{
        type: 'Input',
        rules: ['required'],
        name: 'title',
        label: 'Title',
      }, {
        type: 'Input',
        rules: ['required'],
        name: 'description',
        label: 'Description',
        props: {
          type: 'textarea',
        }
      }, {
        type: 'Radio.Group',
        name: 'modifier',
        options: [{ value: 'public', text: 'Public' }, { value: 'private', text: 'Private' }],
        props: {
          type: 'textarea',
        },
      }],
    },
    buttonLabel: 'New Collection',
  },
}

describe('Transform: form in modal', () => {
  it('transform correctly', () => {
    const content = transformSchema(schema);

    expect(content).toEqual(output);
    // fs.writeFileSync(path.join(__dirname, '../../pages/examples/form.tsx'), content, 'utf8');
  });

  it.only('transform correctly in typescript mode', () => {
    const content = transformSchema(schema, { useTypescript: true });

    // expect(content).toEqual(output);
    fs.writeFileSync(path.join(__dirname, '../../pages/examples/form.tsx'), content, 'utf8');
  });

  it(`transform in hooks mode`, () => {
    const content = transformSchema(schema, { reactApi: 'Hooks' });

    expect(content).toEqual(hooksOutput);
    // fs.writeFileSync(path.join(__dirname, '../../pages/examples/form.tsx'), content, 'utf8');
  })
});