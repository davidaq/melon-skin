import React, { Component } from 'react';
import callapi from 'utils/callapi';
import PageBlock from 'admin/components/utils/page-block';
import { Table, Tooltip, Tag } from 'antd';

class RobotList extends Component {

  componentWillMount() {
    this.onButtonClick = this.onButtonClick.bind(this);
    this.state = {
      robots: [],
    };
    this.refresh();
  }

  async refresh() {
    const robots = await callapi('listRobots');
    this.setState({ robots });
  }

  onButtonClick(index) {
    if (index === 0) {
      this.refresh();
    }
  }

  render() {
    return (
      <div>
        <PageBlock title="机器人列表" buttons={['刷新']} onButtonClick={this.onButtonClick}>
          <Table
            columns={[
              {
                title: '名称',
                key: 'name',
                render(text) {
                  return text || <i>未命名</i>;
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
            dataSource={this.state.robots}
            rowKey={item => item.uuid}
          />
        </PageBlock>
      </div>
    );
  }
}

export default RobotList;
