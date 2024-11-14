import { ShowModalNewRegister } from 'src/Application/Commands';
import { Messages } from 'src/Application/Utilities';
import { Bloc, IFactoryMethodNotifications, IHandleGlobalState, IHandleUserState, IMediatorUseCases, IUseCase } from 'src/Domine/IPatterns';
import { RegisterUserState } from 'src/Domine/IStates';
import { NewOrEditDoctorRequest, NewOrEditSecretaryRequest, RegisterUserRequest } from 'src/Domine/Request';
import { DoctorResponse, ResponseData, RoleResponse, SecretaryResponse } from 'src/Domine/Responses';
import { GroupUser, ModalType } from 'src/Domine/Types';


export class RegisterUserBloc extends Bloc<RegisterUserState> {
  private showModalNewPatient: IUseCase<ModalType, boolean>
  private initial: RegisterUserState = {} as RegisterUserState
  constructor(
    private factoryNotificator: IFactoryMethodNotifications,
    private getAllRolesUseCase: IUseCase<string, RoleResponse[]>,
    private registerUserCase: IUseCase<RegisterUserRequest, Response>,
    private createDoctorUserCase: IUseCase<NewOrEditDoctorRequest, DoctorResponse | null>,
    private createSecretaryUserCase: IUseCase<NewOrEditSecretaryRequest, SecretaryResponse | null>,
    private mediatorUseCase: IMediatorUseCases
  ) {
    const state: RegisterUserState = {
      documentType: null,
      documentNumber: null,
      phoneNumber: null,
      roles: [],
      isActive: true,
      firstName: '',
      lastName: '',
      email: '',
      role: null,
      phoneFormat: null,
      allPhoneFormat: [],
      allDocumentType: [],
      allMedicalOffice: [],
      allSpecialities: [],
      medicalOffice: [],
      medicalRegister: '',
      speciality: []

    };
    super(state);
    this.showModalNewPatient = new ShowModalNewRegister(factoryNotificator)
  }

  async save(): Promise<void> {
    if (this.state.role == null) throw new EvalError('role is null')

    const payload: RegisterUserRequest = {
      email: this.state.email,
      role: this.state.role,
      firstName: this.state.firstName,
      lastName: this.state.lastName
    };

    const confirm: boolean = await this.showModalNewPatient.execute(ModalType.SweetAlert)
    if (!confirm) return

    const response = await this.registerUserCase.execute(payload);
    const data: ResponseData<string> = await response.json()
    if (!response.ok) {
      await this.showErrorNotification(data.result);
      return
    }

    let responseRole: unknown | null = null;
    if (this.state.role == GroupUser.DOCTOR) {
      const doctorRequest: NewOrEditDoctorRequest = {
        documentNumber: this.state.documentNumber == null ? '' : this.state.documentNumber,
        documentTypeId: this.state.documentType == null ? 0 : this.state.documentType,
        lastName: this.state.lastName,
        name: this.state.firstName,
        userId: data.result,
        phoneNumber: this.state.phoneNumber == null ? '' : this.state.phoneNumber,
        specialities: this.state.speciality
      }
      responseRole = await this.createDoctorUserCase.execute(doctorRequest)
    }

    if (this.state.role == GroupUser.SECRETARY) {
      const secretaryRequest: NewOrEditSecretaryRequest = {
        documentNumber: this.state.documentNumber == null ? '' : this.state.documentNumber,
        documentTypeId: this.state.documentType == null ? 0 : this.state.documentType,
        lastName: this.state.lastName,
        name: this.state.firstName,
        userId: data.result,
        phoneNumber: this.state.phoneNumber == null ? '' : this.state.phoneNumber,
        medicalOffice: this.state.medicalOffice == null ? [] : this.state.medicalOffice
      }
      responseRole = await this.createSecretaryUserCase.execute(secretaryRequest)
    }

    if (responseRole == null) {
      await this.showErrorNotification(data.result);
      return
    }

    await this.showSuccessNotification(Messages.successMessage);
    this.clear()
  }

  public asignPhoneFormat() {
    const phoneFormat = this.state.allPhoneFormat.find((option) => {
      return option.numericIso == '170';
    });
    if (phoneFormat === undefined) return

    this.changeState({
      ...this.state,
      phoneFormat: phoneFormat
    });
  }

  async loadInitialData(handleGlobalState: IHandleGlobalState, handlerUserState: IHandleUserState): Promise<void> {
    const infoUser = handlerUserState.getInfoUser()
    const listRoles = await this.getAllRolesUseCase.execute(infoUser.userId);
    const allPhoneFormat = await handleGlobalState.getAllPhoneCodes()
    const allDocumentType = await handleGlobalState.getAllDocumentType();
    const allSpecialities = await handleGlobalState.getAllSpecialities();
    this.changeState({
      ...this.state,
      roles: listRoles,
      allPhoneFormat: allPhoneFormat,
      allDocumentType: allDocumentType,
      allSpecialities: allSpecialities
    });
    this.asignPhoneFormat()
  }

  private async showErrorNotification(message: string): Promise<void> {
    const notificator = this.factoryNotificator.createNotificator(ModalType.NotifyQuasar);
    notificator.setType('error');
    await notificator.show(undefined, message);
  }

  private async showSuccessNotification(message: string): Promise<void> {
    const notificator = this.factoryNotificator.createNotificator(ModalType.NotifyQuasar);
    notificator.setType('success');
    await notificator.show(undefined, message);
  }

  public clear() {
    this.changeState({
      ...this.initial,
      allDocumentType: this.state.allDocumentType, roles: this.state.roles,
      allSpecialities: this.state.allSpecialities
    })
  }

  public async getInfoAdditionalByRole(role: string, handleGlobalState: IHandleGlobalState) {
    if (role == GroupUser.SECRETARY) {
      // const request: MedicalOfficeBelongToUserRequest = {
      //   roleId: GroupUser.DOCTOR,
      //   userId
      // }
      // const listMedicalOffice = await this.mediatorUseCase.getMedicalOfficeBelongToUser(request)
      const listMedicalOffice = handleGlobalState.store.currentMedicalOffice
      console.log(listMedicalOffice);
      this.changeState({ ...this.state, allMedicalOffice: listMedicalOffice })
    }
  }
}
