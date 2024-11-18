import { Dialog, Notify, QNotifyCreateOptions } from 'quasar';
import { Notificator } from 'src/Domine/IPatterns';
import { IconSVG } from 'src/Application/Utilities';
import Swal, {
  SweetAlertIcon,
  SweetAlertOptions,
  SweetAlertResult,
} from 'sweetalert2';
import { NotificationType } from 'src/Domine/Types';
export class Notification implements Notificator {
  private type: 'positive' | 'negative' | 'warning' | 'info' | 'ongoing' =
    'info';

  private message = '';
  private icon = 'none';
  private timer = 2000;
  private icons = IconSVG;
  public async show(title?: string, message?: string): Promise<boolean> {
    if (message != undefined) this.message = message;
    const options: QNotifyCreateOptions = {
      type: this.type,
      message: this.message,
      position: 'top-right',
      timeout: this.timer,
    };

    if (this.icon != 'none') {
      options.icon = this.icon;
      options.color = 'black';
    }
    Notify.create(options);
    return false;
  }

  setType(type: NotificationType): void {
    if (type == 'warning') this.type = 'warning';
    if (type == 'error') this.type = 'negative';
    if (type == 'success') this.type = 'positive';
    if (type == 'question') {
      this.icon = this.icons.question;
    }
  }

  setTime(timerMs: number): void {
    this.timer = timerMs;
  }
}
export class DialogQuasar implements Notificator {
  private message = '';
  private title = '';

  async show(
    title?: string | undefined,
    message?: string | undefined
  ): Promise<boolean> {
    if (message != undefined) this.message = message;
    if (title != undefined) this.title = title;
    Dialog.create({
      title: this.title,
      message: this.message,
      cancel: true,
      persistent: true,
    })
      .onOk(async (data) => {
        console.log('OK', data);
        return true;
      })
      .onCancel(() => {
        console.log('Cancel');
        return false;
      })
      .onDismiss(() => {
        console.log('I am triggered on both OK and Cancel');
        return false;
      });
    return false;
  }
  setType(type: NotificationType): void {
    return;
  }
  setTime(timerMs: number): void {
    return;
  }
}
export class SweetAlertModal implements Notificator {
  private message = '';
  private title = '';
  private icon: SweetAlertIcon = 'info';
  private timeout = 0;

  public async show(
    title?: string | undefined,
    message?: string | undefined
  ): Promise<boolean> {
    if (message != undefined) this.message = message;
    if (title != undefined) this.title = title;
    const objectSweetAlert: SweetAlertOptions = {
      title: this.title,
      allowOutsideClick: false,
      icon: this.icon,
      text: this.message,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      timer: this.timeout,
    };
    const result = (await Swal.fire(objectSweetAlert)) as SweetAlertResult;
    if (result.isConfirmed == true) {
      return true;
    }
    if (result.isDenied == true) {
      return false;
    }
    return false;
  }
  setType(type: NotificationType): void {
    this.icon = type;
  }
  setTime(timerMs: number): void {
    this.timeout = timerMs;
  }
}
export class SweetDrawAttention implements Notificator {
  private message = '';
  private title = '';
  private icon: SweetAlertIcon = 'info';
  private timeout = 0;

  public async show(
    title?: string | undefined,
    message?: string | undefined
  ): Promise<boolean> {
    if (message != undefined) this.message = message;
    if (title != undefined) this.title = title;
    Swal.fire({
      icon: this.icon,
      title: this.title,
      text: this.message,
      allowOutsideClick: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar',
    });
    return false;
  }
  setType(type: NotificationType): void {
    this.icon = type;
  }
  setTime(timerMs: number): void {
    this.timeout = timerMs;
  }
}
