import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu, Button } from 'antd';
import { push } from 'react-router-redux';

class Navigation extends Component {
  render() {
    return (
      <div>
        hello world
        <Button onClick={() => this.props.dispatch(push('/test'))}>he</Button>
      </div>
    );
  }
}

export default connect(state => state)(Navigation);
