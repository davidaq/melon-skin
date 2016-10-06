import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu, Button } from 'antd';
import { push } from 'react-router-redux';
import Login from './login';
import './style.styl';

class Navigation extends Component {
  render() {
    const { authorized, ...other } = this.props;
    if (!authorized) {
      return <Login {...other} />;
    }
    return (
      <div className="navigation">
      </div>
    );
  }
}

export default connect(state => ({
  authorized: state.auth.get('authorized'),
}))(Navigation);
