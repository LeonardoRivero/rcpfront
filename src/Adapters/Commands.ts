import { Messages } from 'src/Application/Utilities';
import {
  ICommand,
  IFactoryMethodNotifications,
  Notificator,
} from 'src/Domine/IPatterns';
import { ModalType } from 'src/Domine/Types';
import { routerInstance } from 'src/boot/globalRouter';
import { RouteLocationRaw } from 'vue-router';

export class NotFoundElementNotify implements ICommand {
  private message: string;
  private urlToRedirect: undefined | RouteLocationRaw;
  private factoryNotifications: IFactoryMethodNotifications;
  private notifySweetAlert: Notificator;
  constructor(
    message: string,
    factoryNotifications: IFactoryMethodNotifications,
    urlToRedirect?: RouteLocationRaw
  ) {
    this.message = message;
    this.factoryNotifications = factoryNotifications;
    this.urlToRedirect = urlToRedirect;
    this.notifySweetAlert = this.factoryNotifications.createNotificator(
      ModalType.SweetAlert
    );
  }
  async execute(): Promise<void> {
    this.notifySweetAlert.setType('error');
    const confirm = await this.notifySweetAlert.show('Error', this.message);
    if (confirm == false) {
      return;
    }

    if (this.urlToRedirect !== undefined) {
      routerInstance.push(this.urlToRedirect);
    }
    return;
  }
}

export class DeleteElementNotify implements ICommand {
  private message: string;
  private factoryNotifications: IFactoryMethodNotifications;
  private notifySweetAlert: Notificator;
  constructor(
    message: string,
    factoryNotifications: IFactoryMethodNotifications
  ) {
    this.message = message;
    this.factoryNotifications = factoryNotifications;
    this.notifySweetAlert = this.factoryNotifications.createNotificator(
      ModalType.SweetAlert
    );
  }
  async execute(): Promise<boolean> {
    this.notifySweetAlert.setType('warning');
    const confirm = await this.notifySweetAlert.show('Atencion', this.message);
    return confirm;
  }
}
