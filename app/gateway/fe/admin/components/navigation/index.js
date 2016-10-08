import React, { Component } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Row, Col, Menu, Icon, Button, Breadcrumb } from 'antd';
import Login from './login';
import * as config from 'admin/sidebar';
import './style.styl';

const sidebarMap = {};

Object.keys(config).forEach(groupKey => {
  const group = config[groupKey];
  const mapItem = { config: group, level1Keys: [] };
  group.forEach(level1 => {
    mapItem.level1Keys.push(level1.key);
    level1.children.forEach(level2 => {
      sidebarMap[level2.key] = {
        ...mapItem,
        level1,
        level2,
      };
    });
  });
});

class Navigation extends Component {

  componentWillMount() {
    this.onMenuClick = this.onMenuClick.bind(this);
  }

  onMenuClick({ key }) {
    this.props.dispatch(push(`${key}`));
  }

  render() {
    const { authorized, children, location: { pathname }, ...other } = this.props;
    if (!authorized) {
      return <Login {...other} />;
    }
    const sidebarConfig = sidebarMap[pathname] || sidebarMap['*'];
    return (
      <section className="whole">
        <section className="sidebar">
          <Menu
            mode="inline"
            defaultOpenKeys={sidebarConfig.level1Keys.slice(0)}
            onClick={this.onMenuClick}
            selectedKeys={[pathname]}
          >
            {sidebarConfig.config.map(level1 =>
              <Menu.SubMenu
                key={level1.key}
                title={<span><Icon type={level1.icon} />{level1.title}</span>}
              >
                {level1.children.map(level2 =>
                  <Menu.Item key={level2.key}>
                    {level2.title}
                  </Menu.Item>
                )}
              </Menu.SubMenu>
            )}
          </Menu>
        </section>
        <section className="main">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Icon type="home" />
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Icon type={sidebarConfig.level1.icon} />
              &nbsp;
              {sidebarConfig.level1.title}
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {sidebarConfig.level2.title}
            </Breadcrumb.Item>
          </Breadcrumb>
          {children}
        </section>
      </section>
    );
  }
}

export default connect(state => ({
  authorized: state.auth.get('authorized'),
}))(Navigation);
