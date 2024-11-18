<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <q-card>
          <q-card-section>
            <div class="text-h6">
              <q-icon name="img:schedule-calendar.svg" size="32px" />
              Admisiones
            </div>
          </q-card-section>
          <q-card-section>
            <q-form @submit="confirmChanges" ref="form" @keydown.enter.prevent>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-sm-6"></div>
                <div class="col-12 col-sm-6">
                  <q-input
                    outlined
                    dense
                    type="number"
                    v-model="state.identificationPatient"
                    @keydown.enter.prevent="patientWasScheduled()"
                    label="N° Identificacion"
                    lazy-rules
                    :rules="[numberRequired]"
                  >
                    <template v-slot:append>
                      <q-btn
                        flat
                        round
                        dense
                        icon="search"
                        class="q-mr-xs"
                        @click="patientWasScheduled()"
                      />
                      <q-tooltip
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        Buscar Paciente
                      </q-tooltip></template
                    >
                  </q-input>
                </div>
                <div class="col-12 col-sm-6">
                  <q-select
                    dense
                    label="Razon Consulta *"
                    v-model="state.currentAppointment.medicalEntryId"
                    :options="state.allReasonConsult"
                    :option-value="(item) => (item === null ? null : item.id)"
                    option-label="description"
                    map-options
                    emit-value
                    :rules="[isNotNull]"
                  ></q-select>
                </div>
                <div class="col-12 col-sm-6">
                  <q-select
                    dense
                    label="Metodo Pago *"
                    v-model="state.currentAppointment.paymentMethodId"
                    :options="state.allPaymentOptions"
                    :option-value="(item) => (item === null ? null : item.id)"
                    option-label="description"
                    emit-value
                    map-options
                    @update:model-value="(val) => changePaymentMethod(val)"
                    :rules="[isNotNull]"
                  ></q-select>
                </div>
                <div class="col-12 col-sm-6">
                  <q-input
                    dense
                    type="text"
                    label="Codigo Transaccion"
                    v-model="state.currentAppointment.transactionCode"
                    :disable="state.disableCodeTransaction"
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input
                    dense
                    v-model="state.copayment"
                    label="Copago"
                    :rules="[isNotNull]"
                    :disable="state.currentAppointment.isParticular"
                    @blur="(evt) => changeCopayment(evt)"
                    @keydown.enter.prevent="(evt:any) =>changeCopayment(evt)"
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input
                    dense
                    type="number"
                    v-model="state.currentAppointment.authorizationNumber"
                    label="N° Autorización"
                    lazy-rules
                    :rules="[numberRequired]"
                    :disable="state.currentAppointment.isParticular"
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input
                    dense
                    v-model="state.price"
                    label="Valor Consulta"
                    lazy-rules
                    :rules="[isNotNull]"
                    clearable
                    @blur="(evt) => changePrice(evt)"
                    @keydown.enter.prevent="(evt:any) =>changePrice(evt)"
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <q-checkbox
                    size="md"
                    v-model="state.currentAppointment.isParticular"
                    val="lg"
                    label="Cita Particular"
                    @update:model-value="(val) => calculateAmountPaid(val)"
                  />
                </div>
                <div class="col-12 col-sm-6">
                  <q-input
                    :bg-color="
                      state.currentAppointment.amountPaid > 0 ? 'green' : 'red'
                    "
                    outlined
                    readonly
                    dense
                    hint="Total monto a pagar"
                    v-model="state.amount"
                    :rules="[isNotNull]"
                  >
                  </q-input>
                </div>
              </div>
              <div class="col-12 col-md-3">
                <q-btn
                  label="Guardar"
                  type="submit"
                  color="primary"
                  :disable="state.disableButtonSave"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Información Adicional</div>
          </q-card-section>
          <q-card-section>
            <div class="col-12 col-sm-6">
              <b>Nombre Paciente:</b>
              {{ state.schedule.patient.name }}
              {{ state.schedule.patient.lastName }}
            </div>
            <div class="col-12 col-sm-6">
              <b>Especialidad :</b> {{ state.schedule.speciality.description }}
            </div>
            <div class="col-12 col-sm-6">
              <b>Entidad :</b>
              {{ state.schedule.healthEntity.name }}
            </div>
            <div class="col-12 col-sm-6">
              <b>Hora Cita:</b>
              <span v-if="state.schedule.start.length != 0">
                {{ new Date(state.schedule.start).toLocaleString() }}
              </span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
  import { onMounted, ref, inject } from 'vue';
  import {
    noLowerZero,
    isNotNull,
    numberRequired,
  } from 'src/Application/Utilities/Helpers';
  import { QForm } from 'quasar';
  import 'src/css/app.sass';
  import { AdmissionsBloc } from 'src/Adapters/AdmissionsBloc';
  import { usePlocState } from 'src/Infraestructure/Utilities/usePlocState';
  import { IHandleGlobalState, IHandleUserState } from 'src/Domine/IPatterns';
  import { IconSVG } from 'src/Application/Utilities';
  const form = ref<QForm>();
  const icons = IconSVG;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dependenciesLocator = inject<any>('dependenciesLocator');
  const controller = <AdmissionsBloc>dependenciesLocator.provideAdmissionBloc();

  const handleGlobalState = <IHandleGlobalState>(
    dependenciesLocator.provideHandleGlobalState()
  );
  const handleUserState = <IHandleUserState>(
    dependenciesLocator.provideHandleUserState()
  );
  const state = usePlocState(controller);

  onMounted(async () => {
    await controller.loadInitialData(handleGlobalState);
  });
  // onUnmounted(async () => {
  //   state.currentPatient = {} as PatientResponse;
  //   state.currentAppointment = {} as IAppointment;
  //   state.identificationPatient = '';
  //   state.currentHealthInsurance = null;
  //   state.speciality = {} as ISpeciality;
  // });
  async function confirmChanges() {
    const isValid = await form.value?.validate();
    if (isValid == false) return;
    await controller.saveOrUpdate(handleUserState);
  }

  function changeCopayment(value: any) {
    // state.value.copayment = currency(value.target.value).format();
    // state.value.currentAppointment.copayment = currency(
    //   value.target.value
    // ).value;
    controller.calculateAmountPaid();
    // state.value.amount = currency(
    //   state.value.currentAppointment.amountPaid
    // ).format();
  }

  function changePrice(value: any) {
    // state.value.currentAppointment.price = currency(value.target.value).value;
    // state.value.price = currency(value.target.value).format();
    controller.calculateAmountPaid();
    // state.value.amount = currency(
    //   state.value.currentAppointment.amountPaid
    // ).format();
  }

  async function changePaymentMethod(idPaymentOption: number) {
    controller.changedPaymentMethod(idPaymentOption);
  }

  function calculateAmountPaid(val: any) {
    // if (val) {
    //   console.log('entr');
    //   state.value.copayment = currency(0).format();
    // }
    controller.calculateAmountPaid();
    // state.value.amount = currency(
    //   state.value.currentAppointment.amountPaid
    // ).format();
  }

  async function patientWasScheduled() {
    await controller.patientWasScheduled(
      handleGlobalState.store.currentMedicalOffice[0].id
    );
  }
</script>
