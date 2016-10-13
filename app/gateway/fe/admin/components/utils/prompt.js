import React, { Component } from 'react';
import { Modal, Form, Input } from 'antd';

const TextInputForm = ({ form }) => (
  form.getFieldDecorator('value')(
    <Input />
  )
);

export default async function (title, defaultValues, InputForm = TextInputForm) {
  let form;
  const BoundInputForm = Form.create({})(class extends Component {
    componentWillMount() {
      form = this.props.form;
      if (defaultValues) {
        if (typeof defaultValues === 'object') {
         form.setFieldsValue(defaultValues);
        } else {
         form.setFieldsValue({ value: defaultValues });
        }
      }
    }
    render() {
      return <InputForm {...this.props} />;
    }
  });
  return new Promise(resolve => {
    Modal.confirm({
      title,
      onOk() {
        form.validateFieldsAndScroll((errors, vals) => {
          if (!errors) {
            resolve(vals);
          }
        });
      },
      onCancel() {
        resolve(null);
      },
      content: <BoundInputForm />,
    });
  });
}
