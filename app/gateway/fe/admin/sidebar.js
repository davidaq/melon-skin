export const general = [
  {
    key: 'space',
    title: '空间',
    icon: 'appstore',
    children: [
      {
        key: '/',
        title: '空间列表',
      },
      {
        key: '/space/create',
        title: '创建空间',
      },
      {
        key: '/space/port',
        title: '导入与导出',
      },
    ],
  },
  {
    key: 'robot',
    title: '机器人',
    icon: 'code-o',
    children: [
      {
        key: '/robot/list',
        title: '机器人列表',
      },
    ],
  },
  {
    key: 'settings',
    title: '设置',
    icon: 'setting',
    children: [
      {
        key: '/settings/sys',
        title: '系统设置',
      },
      {
        key: '/settings/auth',
        title: '登录设置',
      },
    ],
  },
];
