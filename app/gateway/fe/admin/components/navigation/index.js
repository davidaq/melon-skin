import React, { Component } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Row, Col, Menu, Icon, Button } from 'antd';
import Login from './login';
import './style.styl';

class Navigation extends Component {

  componentWillMount() {
    this.onMenuClick = this.onMenuClick.bind(this);
    this.highlight(this.props.location.pathname);
  }

  componentWillReceiveProps(props) {
    this.highlight(props.location.pathname);
  }

  highlight(pathname) {
    this.selectedKeys = [pathname.split('/').slice(0, 3).join('/')];
  }

  onMenuClick({ key }) {
    this.props.dispatch(push(`${key}`));
  }

  render() {
    const { authorized, children, ...other } = this.props;
    if (!authorized) {
      return <Login {...other} />;
    }
    return (
      <section className="whole">
        <section className="sidebar">
          <Menu
            mode="inline"
            defaultOpenKeys={['space', 'settings']}
            onClick={this.onMenuClick}
            selectedKeys={this.selectedKeys}
          >
            <Menu.SubMenu
              key="space"
              title={<span><Icon type="appstore" />空间</span>}
            >
              <Menu.Item key="/">
                空间列表
              </Menu.Item>
              <Menu.Item key="/space/create">
                创建空间
              </Menu.Item>
              <Menu.Item key="/space/port">
                导入与导出
              </Menu.Item>
            </Menu.SubMenu>
            <Menu.SubMenu
              key="settings"
              title={<span><Icon type="setting" />设置</span>}
            >
              <Menu.Item key="/settings/sys">
                系统设置
              </Menu.Item>
              <Menu.Item key="/settings/auth">
                登录设置
              </Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </section>
        <section className="main">
          {children}
        </section>
      </section>
    );
  }
}

export default connect(state => ({
  authorized: state.auth.get('authorized'),
}))(Navigation);
