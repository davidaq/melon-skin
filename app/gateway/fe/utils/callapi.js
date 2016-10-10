import { notification } from 'antd';

class Call {
  constructor(url) {
    if (/^\//.test(url)) {
      this.url = url;
    } else {
      this.url = `/api/${url}`;
    }
    this.payload = null;
    this.willToastError = false;
    this.willToastSuccess = false;
  }

  send(payload) {
    this.payload = payload;
    return this;
  }

  toastError(option = {}) {
    this.willToastError = option;
    return this;
  }

  toastSuccess(option = {}) {
    this.willToastSuccess = option;
    return this;
  }

  async then(resolve, reject) {
    const resp = await fetch(this.url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(this.payload || {}),
    });
    if (resp.status === 200) {
      if (this.willToastSuccess) {
        notification.success({
          message: this.willToastSuccess.title || '操作成功',
          description: this.willToastSuccess.content,
        });
      }
      return resolve(await resp.json());
    } else if (resp.status === 401) {
      location.reload();
    } else {
      const msg = resp.status === 406 ? (await resp.text()) : '网络或服务器内部问题';
      if (this.willToastError) {
        notification[this.willToastError.type || 'error']({
          message: this.willToastError.title || '出错啦',
          description: msg,
        });
        return resolve({ error: msg });
      }
      return reject(msg);
    }
  }
}

export default function(url) {
  return new Call(url);
};
