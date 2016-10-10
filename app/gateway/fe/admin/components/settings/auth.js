import React, { Component } from 'react';
import { Row, Col, Form, Input, Button, Icon, Progress } from 'antd';
import callapi from 'utils/callapi';
import PageBlock from 'admin/components/utils/page-block';

const formLayout = {
  labelCol: { span: 8 },
  wrapperCol: {span: 15 },
};

class AuthSettings extends Component {
  componentWillMount() {
    this.onSave = this.onSave.bind(this);
    this.state = { loading: false, passwordStrength: 0 };
  }

  onSave(vals) {
    return callapi('changePassword').send(vals)
      .toastError({ title: '保存失败' })
      .toastSuccess({ title: '保存成功' });
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
    return (
      <div>
        <PageBlock horizontal title="修改登录口令" form={form} onSave={this.onSave}>
          <Row>
            <Col span="11">
              <Form.Item label="原始登录口令" {...formLayout}>
                {getFieldDecorator('old')(
                  <Input type="password" />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span="11">
              <Form.Item label="新登录口令" {...formLayout}>
                {getFieldDecorator('new', {
                  rules: [
                    {
                      required: true,
                      message: '必须填写新口令',
                    },
                  ],
                  onChange: ev => {
                    setFieldsValue({ confirm: '' });
                    const val = ev.target.value;
                    let strength = 0;
                    if (/[0-9]/.test(val)) {
                      strength += 0.7;
                    }
                    if (/[a-zA-Z]/.test(val)) {
                      strength += 0.7;
                    }
                    if (/[a-z]/.test(val)) {
                      strength += 0.3;
                    }
                    if (/[A-Z]/.test(val)) {
                      strength += 0.5;
                    }
                    if (/[^0-9a-zA-Z]/.test(val)) {
                      strength += 1.2;
                    }
                    strength += val.length / 7;
                    for (let i = 1; i < val.length; i++) {
                      if (Math.abs(val.charCodeAt(i) - val.charCodeAt(i - 1)) <= 1) {
                        strength *= 0.8;
                      }
                    }
                    strength = 100 * Math.min(strength, 6) / 6;
                    this.setState({ passwordStrength: strength });
                  },
                })(
                  <Input type="password" />
                )}
              </Form.Item>
              <Form.Item label="密码强度" {...formLayout}>
                <Progress
                  style={{ marginTop: 12 }}
                  showInfo={false}
                  percent={this.state.passwordStrength}
                  status={
                    ['exception', 'normal', 'success']
                    [Math.floor(this.state.passwordStrength / 40)]
                  }
                />
              </Form.Item>
            </Col>
            <Col span="11">
              <Form.Item label="新登录口令确认" {...formLayout}>
                {getFieldDecorator('confirm', {
                  validateTrigger: 'onBlur',
                  rules: [
                    {
                      validator(rule, value, cb) {
                        const target = getFieldValue('new');
                        if (target && value !== target) {
                          cb(['与新口令不一致']);
                        } else {
                          cb([]);
                        }
                      },
                    },
                  ],
                })(
                  <Input type="password" />
                )}
              </Form.Item>
            </Col>
          </Row>
        </PageBlock>
      </div>
    );
  }
}

export default Form.create({})(AuthSettings);
