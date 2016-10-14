import React, { Component } from 'react';
import { connect } from 'react-redux';
import PageBlock from 'admin/components/utils/page-block';
import prompt from 'admin/components/utils/prompt';
import { Button, Table, Icon, Tooltip, Tag } from 'antd';
import robots from 'admin/reducers/robots';

const { fetchList, ensure, setName } = robots.actions(R => R.robots.x);

class RobotList extends Component {

  componentWillMount() {
    this.onButtonClick = this.onButtonClick.bind(this);
    this.props.dispatch(ensure());
  }

  refresh() {
    this.props.dispatch(fetchList());
  }

  onButtonClick(index) {
    if (index === 0) {
      this.refresh();
    }
  }

  async onEditName(record, index) {
    const name = await prompt('新的机器人名称', record.name);
    if (name) {
      this.props.dispatch(setName(name.value, index));
    }
  }

  render() {
    const { loading, list } = this.props;
    return (
      <div>
        <PageBlock
          title="机器人列表"
          buttons={[
            <span><Icon type={loading ? 'loading' : 'reload'} /> 刷新</span>,
          ]}
          onButtonClick={this.onButtonClick}
        >
          <Table
            pagination={false}
            columns={[
              {
                title: '名称',
                key: 'name',
                render: (text, record, index) => {
                  return (
                    <span>
                      {text || <i>未命名</i>}
                      &nbsp;&nbsp;&nbsp;&nbsp;
                      <Button size="small" onClick={() => this.onEditName(record, index)}>
                        <Icon type="edit" />
                      </Button>
                    </span>
                  );
                },
              },
              {
                title: '状态',
                key: 'online',
                render(status) {
                  return status ? (
                    <Tag color="green">在线</Tag>
                  ) : (
                    <Tag color="blue">离线</Tag>
                  );
                },
              },
              {
                title: 'IP',
                key: 'ip',
              },
              {
                title: '主机',
                key: 'hostName',
                render(text, item) {
                  return (
                    <Tooltip
                      placement="topLeft"
                      title={<span>{item.os}<br />权限：{item.userName}</span>}
                    >
                      <span>{text}</span>
                    </Tooltip>
                  );
                },
              },
              {
                title: 'CPU / 内存',
                key: 'hardware',
                render(t, item) {
                  return `${item.cpuCount}核 / ${item.mem}`;
                },
              },
            ].map(v =>({ ...v, dataIndex: v.key }))}
            dataSource={list}
            rowKey={item => item.uuid}
          />
        </PageBlock>
      </div>
    );
  }
}

export default connect(state => ({
  ...state.robots,
}))(RobotList);
