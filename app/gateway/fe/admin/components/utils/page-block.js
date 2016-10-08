import React, { Component } from 'react';
import './page-block.styl';
import { Form, Button, Icon } from 'antd';

class PageBlock extends Component {
  componentWillMount() {
    this.onSubmit = this.onSubmit.bind(this);
    this.state = { loading: false };
  }

  async onSubmit(ev) {
    ev.preventDefault();
    const { form, onSave } = this.props;
    if (form) {
      form.validateFieldsAndScroll(async (error, vals) => {
        if (error) {
          return;
        }
        this.setState({ loading: true });
        try {
          await onSave(vals);
        } catch (err) {
          console.warn(err);
        }
        this.setState({ loading: false });
      });
    } else {
      this.setState({ loading: true });
      try {
        await onSave(this);
      } catch (err) {
        console.warn(err);
      }
      this.setState({ loading: false });
    }
  }

  render() {
    const { children, title, onSave, ...other } = this.props;
    const isForm = typeof onSave === 'function';
    let Tag;
    if (isForm) {
      Tag = Form;
      other.onSubmit = this.onSubmit;
      delete other.form;
    } else {
      Tag = 'div';
    }
    return (
      <Tag {...other} className="page-block">
        {isForm || title ? (
          <div className="page-block-title">
            <h3>{title}</h3>
            {isForm ? (
              <Button type="primary" htmlType="submit" disabled={this.state.loading}>
                <Icon type={this.state.loading ? 'loading' : 'save'} />
                保存
              </Button>
            ) : null}
          </div>
        ) : null}
        <div className="page-block-content">
          {children}
        </div>
      </Tag>
    );
  }
}

export default PageBlock;
