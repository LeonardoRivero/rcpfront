import {
  IFactoryMethodNotifications,
  ModalType,
  Notificator,
} from 'src/Domine/IPatterns';
import {
  DialogQuasar,
  Notification,
  SweetAlertModal,
  SweetDrawAttention,
} from 'src/Infraestructure/Utilities/Notifications';

export class FactoryNotifactors implements IFactoryMethodNotifications {
  private static instance: FactoryNotifactors;
  private constructor() {
    return;
  }
  public static getInstance(): FactoryNotifactors {
    if (!FactoryNotifactors.instance) {
      FactoryNotifactors.instance = new FactoryNotifactors();
    }
    return FactoryNotifactors.instance;
  }
  createNotificator(notificationType: ModalType): Notificator {
    if (notificationType.toString() === 'SweetAlert') {
      return new SweetAlertModal();
    }
    if (notificationType.toString() === 'NotifyQuasar') {
      return new Notification();
    }
    if (notificationType.toString() === 'ModalQuasar') {
      return new DialogQuasar();
    }
    if (notificationType.toString() === 'DrawAttention') {
      return new SweetDrawAttention();
    }
    throw new Error('Notificacion type is not available');
  }
}
