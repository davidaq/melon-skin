import React, { Component } from 'react';
import { connect } from 'react-redux';
import PageBlock from 'admin/components/utils/page-block';
import callapi from 'utils/callapi';
import { Row, Col, Popconfirm, Button, Tag, Form, Input, InputNumber } from 'antd';

const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: {span: 14 },
};

const WebSettings = Form.create({})(
  class extends Component {
    async componentWillMount() {
      const { form } = this.props;
      const sysSettings = await callapi('getSysSettings');
      form.setFieldsValue(sysSettings);
    }

    onSave(vals) {
      return callapi('setSysSettings').send(vals)
        .toastError({ title: '保存失败' })
        .toastSuccess({ title: '保存成功' });
    }

    render() {
      const { form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <PageBlock title="Web设置" onSave={this.onSave} form={form}>
          <Form.Item label="端口" {...formLayout}>
            {getFieldDecorator('gateway:port', {
              rules: [
                {
                  type: 'number',
                  required: true,
                  message: '必须填写端口号',
                },
              ],
            })(
              <InputNumber min={10} max={65530} />
            )}
          </Form.Item>
          <Form.Item label="域名" {...formLayout}>
            {getFieldDecorator('gateway:domain')(
              <Input />
            )}
          </Form.Item>
          <Row>
            <Col {...formLayout.labelCol} />
            <Col {...formLayout.wrapperCol}>
              <Tag color="red">
                注意：保存后服务器需要进行重启设置才可生效。
              </Tag>
            </Col>
          </Row>
        </PageBlock>
      );
    }
  }
);

const DBSettings = Form.create({})(
  class extends Component {
    async componentWillMount() {
      const { form } = this.props;
      const sysSettings = await callapi('getSysSettings');
      form.setFieldsValue(sysSettings);
    }

    onSave(vals) {
      return callapi('setSysSettings').send(vals)
        .toastError({ title: '保存失败' })
        .toastSuccess({ title: '保存成功' });
    }

    render() {
      const { form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <PageBlock title="数据库设置" onSave={this.onSave} form={form}>
          <Form.Item label="主机地址" {...formLayout}>
            {getFieldDecorator('db:addr')(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="端口" {...formLayout}>
            {getFieldDecorator('db:port')(
              <InputNumber min={10} max={65530} />
            )}
          </Form.Item>
          <Form.Item label="数据库名" {...formLayout}>
            {getFieldDecorator('db:dbname')(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="用户名" {...formLayout}>
            {getFieldDecorator('db:username')(
              <Input />
            )}
          </Form.Item>
          <Form.Item label="密码" {...formLayout}>
            {getFieldDecorator('db:password')(
              <Input type="password" />
            )}
          </Form.Item>
        </PageBlock>
      );
    }
  }
);

class Operations extends Component {

  componentWillMount() {
    this.restartServer = this.restartServer.bind(this);
  }

  async restartServer() {
    await callapi('restart');
  }
  
  render() {
    return (
      <PageBlock title="操作">
        <Popconfirm
          placement="topRight"
          title="确认要重启服务器吗？这可能会造成短暂的不可访问。"
          onConfirm={this.restartServer}
        >
          <Button type="primary" size="large" style={{ width: '100%' }}>
            重启服务器
          </Button>
        </Popconfirm>
      </PageBlock>
    );
  }
}

const SysSettings = () => (
  <Row>
    <Col span="17">
      <WebSettings />
      <DBSettings />
    </Col>
    <Col span="1" />
    <Col span="6">
      <Operations />
    </Col>
  </Row>
);

export default SysSettings;
