import {
  IFactoryMethodNotifications,
  ModalType,
  Notificator,
} from 'src/Domine/IPatterns';
import {
  DialogQuasar,
  Notification,
  SweetAlertModal,
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
    if (notificationType == 'sweetAlert') {
      return new SweetAlertModal();
    }
    if (notificationType == 'notifyQuasar') {
      return new Notification();
    }
    if (notificationType == 'modalQuasar') {
      return new DialogQuasar();
    }
    throw new Error('Notificacion type is not available');
  }
}
