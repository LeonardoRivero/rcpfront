<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8" :class="{ 'order-first': !$q.screen.xs }">
        <div class="text-h6 text-grey">
          <q-icon name="img:schedule-calendar.svg" size="32px" />
          Admisiones
          <q-separator inset />
        </div>
        <q-form @submit="confirmChanges" ref="form" @keydown.enter.prevent>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6"></div>
            <div class="col-12 col-sm-6">
              <q-input
                dense
                v-model="state.identificationPatient"
                @keydown.enter.prevent="patientWasScheduled()"
                label="N° Identificacion"
                :rules="[anySpace]"
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
                  <q-tooltip transition-show="scale" transition-hide="scale">
                    Buscar Paciente
                  </q-tooltip></template
                >
              </q-input>
            </div>
            <div class="col-12 col-sm-6">
              <q-select
                dense
                label="Via de entrada *"
                v-model="state.currentAppointment.medicalEntryId"
                :options="state.allMedicalEntry"
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
                :rules="[
                  isNotNull,
                  (val) =>
                    currency(val).value >= 0 ||
                    'El valor no puede ser negativo',
                ]"
                :disable="state.currentAppointment.isParticular"
                @blur="(evt) => changeCopayment()"
                @keydown.enter.prevent="(evt:any) =>changeCopayment()"
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
                :rules="[
                  isNotNull,
                  (val) =>
                    currency(val).value >= 0 ||
                    'El valor no puede ser negativo',
                ]"
                clearable
                @blur="(evt) => changePrice()"
                @keydown.enter.prevent="(evt:any) =>changePrice()"
                :error="error"
                :error-message="errorMessage"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-checkbox
                size="md"
                v-model="state.currentAppointment.isParticular"
                val="lg"
                label="Cita Particular"
                @update:model-value="(val) => calculateAmountPaid()"
              />
            </div>
            <div class="col-12 col-sm-6">
              <q-chip
                :color="
                  currency(state.amount ?? '0').value >= 0 ? 'green' : 'red'
                "
                text-color="white"
              >
                <b>TOTAL :</b> {{ state.amount }}
              </q-chip>
            </div>
          </div>
          <br />
          <div class="col-12 col-md-12">
            <q-btn
              label="Guardar"
              type="submit"
              color="primary"
              :disable="state.disableButtonSave"
            />
          </div>
        </q-form>
      </div>

      <div class="col-12 col-md-4" :class="{ 'order-first': $q.screen.xs }">
        <q-card flat bordered class="bg-grey-1">
          <q-card-section>
            <div class="text-h6 text-grey">Información Adicional</div>
          </q-card-section>
          <q-card-section>
            <div class="col-12 col-sm-6">
              <b>Nombre Paciente : </b>
              <q-skeleton type="text" v-if="state.showSkeleton" />
              {{ state.schedule.patient.name }}
              {{ state.schedule.patient.lastName }}
            </div>
            <div class="col-12 col-sm-6">
              <b>Especialidad : </b>
              <q-skeleton type="text" v-if="state.showSkeleton" />
              {{ state.schedule.speciality.description }}
            </div>
            <div class="col-12 col-sm-6">
              <b>Entidad : </b>
              <q-skeleton type="text" v-if="state.showSkeleton" />
              {{ state.schedule.healthEntity.name }}
            </div>
            <div class="col-12 col-sm-6">
              <b>Hora Cita : </b>
              <q-skeleton type="text" v-if="state.showSkeleton" />
              <span v-if="state.schedule.start.length != 0">
                {{ new Date(state.schedule.start).toLocaleString() }}
              </span>
            </div>
            <div class="col-12 col-sm-6">
              <b>Consultorio : </b>
              <q-skeleton type="text" v-if="state.showSkeleton" />
              <span v-if="state.schedule.medicalOffice !== undefined">
                {{ state.schedule.medicalOffice.name }}
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
    anySpace,
    isNotNull,
    numberRequired,
  } from 'src/Application/Utilities/Helpers';
  import { QForm } from 'quasar';
  import 'src/css/app.sass';
  import { AdmissionsBloc } from 'src/Adapters/AdmissionsBloc';
  import { usePlocState } from 'src/Infraestructure/Utilities/usePlocState';
  import { IHandleGlobalState, IHandleUserState } from 'src/Domine/IPatterns';
  import currency from 'currency.js';
  const form = ref<QForm>();
  const error = ref<boolean>(false);
  const errorMessage = ref<string>('');
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

  function changeCopayment() {
    // state.value.copayment = currency(value.target.value).format();
    // state.value.currentAppointment.copayment = currency(
    //   value.target.value
    // ).value;
    controller.calculateAmountPaid();
    // state.value.amount = currency(
    //   state.value.currentAppointment.amountPaid
    // ).format();
  }

  function changePrice() {
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

  function calculateAmountPaid() {
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
      handleGlobalState.store.currentMedicalOffice
    );
  }
</script>
