import { notification } from 'antd';

class Call {
  constructor(url) {
    this.url = url;
    this.payload = null;
    this.willToastError = false;
  }

  send(payload) {
    this.payload = payload;
    return this;
  }

  toastError(option = {}) {
    this.willToastError = option;
    return this;
  }

  async then(resolve, reject) {
    const resp = await fetch(this.url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(this.payload),
    });
    if (resp.status === 200) {
      return resolve(await resp.json());
    } else if (resp.status === 406) {
      const msg = await resp.text();
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
}
