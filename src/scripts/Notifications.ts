import { useRouter } from 'vue-router';
import { Notify, Dialog } from 'quasar';
import { Loading, QSpinnerGears } from 'quasar';
import route from 'src/router/index';

export class Notification {
  private _message = '' as string;
  private _type = 'info' as string;
  setMessage(message: string): void {
    this._message = message;
  }
  private triggerNotification(): void {
    Notify.create({
      type: this._type,
      message: this._message,
      position: 'top-right',
      timeout: 2000,
    });
  }
  showError(): void {
    this._type = 'negative';
    this.triggerNotification();
  }
  showInfo(): void {
    this._type = 'info';
    this.triggerNotification();
  }
  showSuccess(): void {
    this._type = 'positive';
    this.triggerNotification();
  }
  showWarning(): void {
    this._type = 'warning';
    this.triggerNotification();
  }
}
export class Modal {
  private _message = '' as string;
  private _url = '' as string;
  private _title = '' as string;
  private _redirectPage = false as boolean;
  private triggerModal(): void {
    Dialog.create({
      title: this._title,
      message: this._message,
      cancel: true,
      persistent: true,
    })
      .onOk(async (data) => {
        console.log('OK', data);
        if (this._redirectPage) {
          //route().push({ name: 'patients' });
        }
      })
      .onCancel(() => {
        console.log('Cancel');
      })
      .onDismiss(() => {
        console.log('I am triggered on both OK and Cancel');
      });
  }
  public withRedirectPage(
    title: string,
    message: string,
    urlToRedirect: string
  ) {
    this._message = message;
    this._url = urlToRedirect;
    this._title = title;
    this._redirectPage = true;
    this.triggerModal();
  }
  public showLoading(): void {
    Loading.show();
  }
  public hideLoading(): void {
    Loading.hide();
  }
}
