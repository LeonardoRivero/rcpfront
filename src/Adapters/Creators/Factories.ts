import { IFactoryMethodNotifications, Notificator } from 'src/Domine/IPatterns';
import { ModalType } from 'src/Domine/Types';
import {
  DialogQuasar,
  Notification,
  SweetAlertModal,
  SweetDrawAttention,
} from 'src/Infraestructure/Utilities/Notifications';

export class FactoryNotifactors implements IFactoryMethodNotifications {
  private static instance: FactoryNotifactors;
  private notifications: Record<string, Notificator>;
  private constructor() {
    this.notifications = {
      SweetAlert: new SweetAlertModal(),
      NotifyQuasar: new Notification(),
      ModalQuasar: new DialogQuasar(),
      DrawAttention: new SweetDrawAttention(),
    };
  }
  public static getInstance(): FactoryNotifactors {
    if (!FactoryNotifactors.instance) {
      FactoryNotifactors.instance = new FactoryNotifactors();
    }
    return FactoryNotifactors.instance;
  }
  createNotificator(notificationType: ModalType): Notificator {
    if (notificationType.toString() in this.notifications) {
      return this.notifications[notificationType.toString()];
    }
    throw new Error('Notificacion type is not available');
  }
}

// export class FactorySpecialities
//   implements AbstractFactory<ISpeciality, SpecialityResponse>
// {
//   private repository: Repository<ISpeciality>;
//   public constructor() {
//     this.repository = this.createRepository();
//   }
//   createController(): ControllerTest {
//     throw new Error('Method not implemented.');
//   }
//   createService(): Service<ISpeciality, SpecialityResponse> {
//     return new SpecialityService(this.repository);
//   }
//   createRepository() {
//     return new SpecialityRepository();
//   }
// }
