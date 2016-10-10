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
    const { buttons, onButtonClick, children, title, onSave, ...other } = this.props;
    const isForm = typeof onSave === 'function';
    let Tag;
    if (isForm) {
      Tag = Form;
      other.onSubmit = this.onSubmit;
      delete other.form;
    } else {
      Tag = 'div';
    }
    const showTitle = isForm || title || (Array.isArray(buttons) && buttons.length > 0);
    return (
      <Tag {...other} className="page-block">
        {showTitle ? (
          <div className="page-block-title">
            <h3>{title}</h3>
            <div className="buttons">
              {buttons.map((name, i) =>
                <Button
                  key={i}
                  htmlType="button"
                  onClick={() => onButtonClick && onButtonClick(i)}
                >
                  {name}
                </Button>
              )}
              {isForm ? (
                <Button type="primary" htmlType="submit" disabled={this.state.loading}>
                  <Icon type={this.state.loading ? 'loading' : 'save'} />
                  保存
                </Button>
              ) : null}
            </div>
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
