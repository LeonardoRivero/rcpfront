<template>
  <q-form @submit="confirmChanges" ref="form">
    <q-list>
      <q-item>
        <q-item-section>
          <q-item-label class="q-pb-xs"
            >Datos Paciente
            <small>
              <cite
                >(Antes de crear la cita,verifique la informacion del
                paciente)</cite
              >
            </small>
          </q-item-label>
          <div class="row q-col-gutter-x-md">
            <div class="col-6 col-md">
              <q-select
                dense
                label="Entidad"
                outlined
                v-model="state.currentHealthInsurance"
                :options="listInsurancePatient"
                :option-value="(item) => (item === null ? null : item.id)"
                option-label="nameInsurance"
                map-options
                stack-label
                :disable="disableListInsurance"
                @update:model-value="(val) => calculateAmountPaid(val)"
                :rules="[(val) => (val && val != null) || FIELD_REQUIRED]"
              ></q-select>
            </div>
            <div class="col-6 col-md">
              <q-input
                dense
                type="number"
                outlined
                v-model="state.identificationPatient"
                @keydown.enter.prevent="searchPatient()"
                label="N° Identificacion"
                lazy-rules
                :rules="[(val) => val > 0 || 'Numero invalido']"
              >
                <template v-slot:append>
                  <q-btn
                    flat
                    round
                    dense
                    icon="search"
                    class="q-mr-xs"
                    @click="searchPatient()"
                  />
                  <q-tooltip transition-show="scale" transition-hide="scale">
                    Buscar Paciente
                  </q-tooltip></template
                >
              </q-input>
            </div>
          </div>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <div class="row q-col-gutter-x-md">
            <div class="col-6 col-md">
              <q-input
                dense
                outlined
                v-model="state.currentPatient.name"
                label="Nombre Paciente"
                readonly
              />
            </div>
            <div class="col-6 col-md">
              <q-input
                dense
                outlined
                v-model="state.currentPatient.lastName"
                label="Apellido Paciente"
                readonly
              />
            </div>
          </div>
        </q-item-section>
      </q-item>
      <q-slide-transition>
        <div>
          <q-item>
            <q-item-section>
              <q-item-label class="q-pb-xs">Datos Consulta</q-item-label>
              <div class="row q-col-gutter-x-md">
                <div class="col-12 col-md-6">
                  <q-input
                    dense
                    type="text"
                    outlined
                    v-model="state.speciality.description"
                    label="Especialidad"
                    readonly
                    hint=" "
                  />
                </div>
                <div class="col-12 col-md-6">
                  <q-input
                    dense
                    outlined
                    v-model="state.currentAppointment.date"
                    label="Fecha Cita"
                    :hint="`Finalizacion Cita: ${
                      state.currentAppointment.end == undefined
                        ? ''
                        : state.currentAppointment.end
                    }`"
                    readonly
                  >
                  </q-input>
                </div>
              </div>
              <div class="row q-col-gutter-x-md">
                <div class="col-12 col-md-4">
                  <q-input
                    dense
                    type="number"
                    outlined
                    v-model="state.currentAppointment.authorizationNumber"
                    label="N° Autorización"
                    lazy-rules
                    :rules="[(val) => val > 0 || 'Autorizacion invalida']"
                  />
                </div>
                <div class="col-12 col-md-4">
                  <q-select
                    dense
                    label="Razon Consulta"
                    outlined
                    v-model="state.currentAppointment.reasonConsult"
                    :options="state.allReasonConsult"
                    :option-value="(item) => (item === null ? null : item.id)"
                    option-label="abbreviation"
                    map-options
                    emit-value
                    stack-label
                    :rules="[(val) => (val && val != null) || FIELD_REQUIRED]"
                  ></q-select>
                </div>
                <div class="col-12 col-md-4">
                  <q-select
                    dense
                    outlined
                    v-model="state.currentAppointment.patientStatus"
                    :options="state.allPatientStatus"
                    :option-value="(item) => (item === null ? null : item.id)"
                    option-label="description"
                    map-options
                    emit-value
                    stack-label
                    label="Estado Paciente"
                    :rules="[(val) => (val && val != null) || FIELD_REQUIRED]"
                  ></q-select>
                </div>
              </div>
              <div class="row q-col-gutter-x-md">
                <div class="col-12 col-md-4">
                  <q-input
                    prefix="$"
                    dense
                    type="number"
                    outlined
                    v-model="state.currentAppointment.copayment"
                    label="Copago"
                    @update:model-value="(val) => calculateAmountPaid(val)"
                    lazy-rules
                    :rules="[(val) => val >= 0 || 'Valor copago invalido']"
                  />
                </div>
                <div class="col-12 col-md-4">
                  <q-input
                    dense
                    type="text"
                    outlined
                    label="Codigo Transaccion"
                    v-model="state.currentAppointment.codeTransaction"
                    :disable="disableCodeTransaction"
                  />
                </div>
                <div class="col-12 col-md-4">
                  <q-select
                    dense
                    label="Metodo Pago"
                    outlined
                    v-model="state.currentAppointment.paymentMethod"
                    @update:model-value="(val) => changePaymentMethod(val)"
                    :options="state.allPaymentOptions"
                    :option-value="(item) => (item === null ? null : item.id)"
                    option-label="description"
                    map-options
                    emit-value
                    stack-label
                    :rules="[(val) => (val && val != null) || FIELD_REQUIRED]"
                  ></q-select>
                </div>
              </div>
              <div class="row q-col-gutter-x-md">
                <div class="col-12 col-md-4">
                  <q-input
                    prefix="$"
                    dense
                    type="number"
                    outlined
                    v-model="state.currentAppointment.price"
                    label="Valor Consulta"
                    @update:model-value="(val) => calculateAmountPaid(val)"
                    lazy-rules
                    :rules="[(val) => val >= 0 || 'Valor consulta invalido']"
                  />
                </div>
              </div>
              <div class="row q-col-gutter-x-md">
                <div class="col-12 col-md-4 align-xright">
                  <q-input
                    outlined
                    :bg-color="
                      state.currentAppointment.amountPaid > 0 ? 'green' : 'red'
                    "
                    readonly
                    dense
                    hint="Total monto a pagar"
                    v-model="state.currentAppointment.amountPaid"
                    type="number"
                    prefix="$"
                  >
                  </q-input>
                </div>
              </div>
            </q-item-section>
          </q-item>
        </div>
      </q-slide-transition>
    </q-list>
    <q-card-actions align="right" class="text-teal">
      <q-btn
        label="Guardar"
        type="submit"
        color="primary"
        :disable="disableListInsurance"
      />
    </q-card-actions>
  </q-form>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, reactive, ref } from 'vue';
import {
  DoctorResponse,
  DoctorSpecialityResponse,
  HealthInsuranceResponse,
  PatientResponse,
  PatientStatusResponse,
} from 'src/Domine/Responses';
import { IAppointment, ISpeciality } from 'src/Domine/ModelsDB';
import {
  OPTIONS_HOURS,
  OPTIONS_MINUTES,
  CURRENTYEAR_MONTH,
  FORMAT_DATETIME,
  FIELD_REQUIRED,
} from 'src/Application/Utilities';
import { AppointmentAdapter } from 'src/Adapters';
import { PaymentOptionsService } from 'src/Application/Services/PaymentOptionsService';
import { ReasonConsultService } from 'src/Application/Services/ReasonConsultService';
import { PatientStatusService } from 'src/Application/Services/PatientStatusService';
import {
  AppointmentMediator,
  PatientMediator,
  ScheduleMediator,
  SettingsMediator,
} from 'src/Infraestructure/Mediators';
import { QForm } from 'quasar';
import { AppointmentState } from 'src/Domine/IStates';
import 'src/css/app.sass';

export default defineComponent({
  name: 'Appointment_Form',
  setup() {
    const HOURS_ALLOWED = OPTIONS_HOURS;
    const MINUTES_ALLOWED = OPTIONS_MINUTES;
    // const CURRENTYEARMONTH = CURRENTYEAR_MONTH;
    // const FORMATDATETIME = FORMAT_DATETIME;
    const form = ref<QForm>();
    const state: AppointmentState = reactive({
      identificationPatient: '',
      currentPatientStatus: null,
      currentHealthInsurance: null,
      reasonConsult: null,
      speciality: {} as ISpeciality,
      currentDoctor: {} as DoctorSpecialityResponse,
      currentAppointment: {} as IAppointment,
      currentPatient: {} as PatientResponse,
      currentPaymentOption: null,
      allPaymentOptions: [],
      allReasonConsult: [],
      allPatientStatus: <Array<PatientStatusResponse>>[],
    });
    const service = AppointmentAdapter.getInstance(state);
    const mediator = AppointmentMediator.getInstance();
    const patientMediator = PatientMediator.getInstance();
    const scheduleMediator = ScheduleMediator.getInstance();
    const settingsMediator = SettingsMediator.getInstance();
    const serviceReasonConsult = ReasonConsultService.getInstance();
    const servicePatienStatus = PatientStatusService.getInstance();
    const listInsurancePatient = ref<Array<HealthInsuranceResponse>>([]);

    const disableListInsurance = ref<boolean>(true);
    const disableCodeTransaction = ref<boolean>(false);
    onMounted(async () => {
      state.allPaymentOptions = await mediator.getAllPaymentOptions();
      state.allReasonConsult = await serviceReasonConsult.getAll();
      state.allPatientStatus = await servicePatienStatus.getAll();
    });
    onUnmounted(async () => {
      state.currentPatient = {} as PatientResponse;
      state.currentAppointment = {} as IAppointment;
      state.identificationPatient = '';
      state.currentHealthInsurance = null;
      state.speciality = {} as ISpeciality;
    });

    return {
      CURRENTYEAR_MONTH,
      HOURS_ALLOWED,
      MINUTES_ALLOWED,
      FORMAT_DATETIME,
      FIELD_REQUIRED,
      form,
      disableListInsurance,
      async confirmChanges() {
        const isValid = await form.value?.validate();
        if (isValid == false) return;
        // const response = await service.saveOrUpdate(
        //   state.currentAppointment,
        //   state.currentPatient,
        //   state.currentDoctor
        // );
        // if (response != null) {
        //   state.currentAppointment = {} as IAppointment;
        //   state.currentPatient = {} as PatientResponse;
        //   state.currentHealthInsurance = null;
        //   state.speciality = {} as ISpeciality;
        //   state.identificationPatient = '';
        //   form.value?.reset();
        // }
      },
      async changePaymentMethod(idPaymentOption: number) {
        const isCash = await servicePaymentOptions.paymentIsCash(
          idPaymentOption
        );
        disableCodeTransaction.value = isCash;
        service.paymentIsCash(isCash);
      },

      calculateAmountPaid(val: any) {
        service.calculateAmountPaid();
      },

      async searchPatient() {
        const patient = await patientMediator.searchByIdentificacion(
          state.identificationPatient
        );
        if (patient === null) {
          await patientMediator.patientNotFound();
          return;
        }
        const schedule = await scheduleMediator.findByIdentificationPatient(
          patient.identification.toString()
        );
        if (schedule === null) {
          await scheduleMediator.scheduleNotFound();
          return;
        }
        // state.currentAppointment.schedule = schedule.id;
        // state.currentAppointment.date = new Date(
        //   schedule.start
        // ).toLocaleString();
        // state.currentPatient = schedule.patient;
        // state.currentHealthInsurance = schedule.patient.insurance;
        // state.speciality = schedule.speciality;
        // state.currentDoctor = schedule.doctor;
        // listInsurancePatient.value = settingsMediator.addToArrayDefault(
        //   schedule.patient.insurance
        // );
        // disableListInsurance.value = false;
      },
      listInsurancePatient,
      state,
      disableCodeTransaction,
    };
  },
});
</script>
