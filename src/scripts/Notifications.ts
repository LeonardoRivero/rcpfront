import { Notify, Dialog } from 'quasar';

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
  public triggerModal(): void {
    Dialog.create({
      title: 'Alerta',
      message: 'Paciente no creado.Desea crear el paciente ahora mismo',
      cancel: true,
      persistent: true,
    })
      .onOk((data) => {
        console.log('OK', data);
      })
      .onCancel(() => {
        console.log('Cancel');
      })
      .onDismiss(() => {
        console.log('I am triggered on both OK and Cancel');
      });
  }
}
