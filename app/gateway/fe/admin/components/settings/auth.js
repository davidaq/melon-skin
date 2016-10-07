import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Form, Input, Button, Breadcrumb, Icon } from 'antd';
import callapi from 'utils/callapi';

const formLayout = {
  labelCol: { span: 6 },
  wrapperCol: {span: 8 },
};

class AuthSettings extends Component {
  componentWillMount() {
    this.onSubmit = this.onSubmit.bind(this);
    this.state = { loading: false };
  }

  onSubmit(e) {
    e.preventDefault();
    if (this.state.loading) {
      return;
    }
    const { form: { validateFieldsAndScroll } } = this.props;
    validateFieldsAndScroll(async (error, vals) => {
      if (error) {
        return;
      }
      this.setState({ loading: true });
      await callapi('/change-password').send(vals)
        .toastError({ title: '保存失败' })
        .toastSuccess({ title: '保存成功' });
      this.setState({ loading: false });
    });
  }

  render() {
    const { form: { getFieldDecorator, getFieldValue, setFieldsValue } } = this.props;
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Icon type="home" />
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Icon type="setting" />
            设置
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            登录设置
          </Breadcrumb.Item>
        </Breadcrumb>

        <div className="page-block">
          <Form horizontal onSubmit={this.onSubmit}>
            <Form.Item label="原始登录口令" {...formLayout}>
              {getFieldDecorator('old')(
                <Input type="password" />
              )}
            </Form.Item>
            <Form.Item label="新登录口令" {...formLayout}>
              {getFieldDecorator('new', {
                rules: [
                  {
                    required: true,
                    message: '必须填写新口令',
                  },
                ],
                onChange() {
                  setFieldsValue({ confirm: '' });
                },
              })(
                <Input type="password" />
              )}
            </Form.Item>
            <Form.Item label="新登录口令确认" {...formLayout}>
              {getFieldDecorator('confirm', {
                validateTrigger: 'onBlur',
                rules: [
                  {
                    validator(rule, value, cb) {
                      if (value !== getFieldValue('new')) {
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
            <Row>
              <Col {...formLayout.labelCol} />
              <Col {...formLayout.wrapperCol}>
                <Button loading={this.state.loading} type="primary" htmlType="submit">
                  <Icon type="save" />保存
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  ...state,
}))(Form.create({})(AuthSettings));
