
export class BasicAction {
  message = '';
  status: null | 'progress' | number = null;

  setStatus(status: 'progress' | number) {
    this.status = status;
  }

  resetStatus() {
    this.status = null;
  }

  getNotNullStatus() {
    return this.status || 0;
  }

  isSuccess() {
    return this.status >= 200 && this.status < 300;
  }
}

export type TypingAction = false | 'typing' | 'saving' | 'done';
