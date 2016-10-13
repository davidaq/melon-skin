import React, { Component } from 'react';
import { Row, Col, Button, Input, Form } from 'antd';
import callapi from 'utils/callapi';
import auth from 'admin/reducers/auth';

const { setAuthorized } = auth.actions(R => R.auth);

class Login extends Component {
  componentWillMount() {
    this.onSubmit = this.onSubmit.bind(this);
    this.onCaptchaClick = this.onCaptchaClick.bind(this);
    this.state = {
      captchaKey: Date.now(),
    };
  }
  
  onSubmit(e) {
    e.preventDefault();
    this.props.dispatch(setAuthorized(true));
    return;
    const { form: { validateFieldsAndScroll }, dispatch } = this.props;
    validateFieldsAndScroll(async (errors, vals) => {
      if (errors) {
        return;
      }
      const success = await dispatch(authActions.login(vals));
      if (!success) {
        this.setState({ captchaKey: Date.now() });
      }
    });
  }

  onCaptchaClick() {
    this.setState({
      captchaKey: Date.now(),
    });
  }

  render() {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <section className="login">
        <Form inline onSubmit={this.onSubmit}>
          <Row>
            <Col span="12">
              <Form.Item label="口令">
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '必须填写密码' }],
                })(
                  <Input type="password" />
                )}
              </Form.Item>
            </Col>
            <Col span="12">
              <Form.Item label="验证码">
                {getFieldDecorator('captcha', {
                  rules: [{ required: true, message: '必须填写验证码' }],
                })(
                  <Input placeholder="只字母，大小写不敏感" />
                )}
              </Form.Item>
              <img
                onClick={this.onCaptchaClick}
                src={`/captcha?${this.state.captchaKey}`}
              />
            </Col>
          </Row>
          <br />
          <Row>
            <Col span="6">
              <Button type="primary" htmlType="submit">登录</Button>
            </Col>
            <Col span="18">
              <p style={{ padding: 5 }}>
                请使用最新版本的Chrome以确保使用体验
              </p>
            </Col>
          </Row>
        </Form>
      </section>
    );
  }
}

export default Form.create({})(Login);
