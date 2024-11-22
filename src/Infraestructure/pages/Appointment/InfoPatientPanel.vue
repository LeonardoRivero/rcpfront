<template>
  <q-card flat bordered class="bg-grey-1">
    <q-card-actions>
      <q-item-label caption>Nombre:</q-item-label>
      <q-item-label class="q-mb-xs">
        <b
          >{{ state.currentPatient?.name }}
          {{ state.currentPatient?.lastName }}</b
        ></q-item-label
      >
      <q-space />
      <q-item-label caption>N° Identificacion:</q-item-label>
      <q-item-label class="q-mb-xs">
        {{ state.identificationPatient }}</q-item-label
      >
      <q-space />

      <q-btn
        color="grey"
        round
        flat
        dense
        :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
        @click="expanded = !expanded"
      />
    </q-card-actions>
    <q-slide-transition>
      <div v-show="expanded">
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-5">
              <q-item-label caption>Telefono/Celular:</q-item-label>
              <q-item-label class="q-mb-xs">
                <q-skeleton type="text" v-if="state.showSkeleton" />
                {{ state.currentPatient?.phoneNumber }}</q-item-label
              >

              <q-item-label caption>Entidad Salud:</q-item-label>
              <q-item-label class="q-mb-xs">
                <q-skeleton type="text" v-if="state.showSkeleton" />{{
                  state.currentPatient?.healthEntity.name
                }}</q-item-label
              >

              <q-item-label caption>Primera Consulta:</q-item-label>
              <q-item-label class="q-mb-xs">{{
                state.currentPatient?.healthEntity.name
              }}</q-item-label>
            </div>
            <div class="col-12 col-sm-7">
              <q-item-label caption>Correo Electronico:</q-item-label>
              <q-item-label class="q-mb-xs">
                <q-skeleton type="text" v-if="state.showSkeleton" />
                {{ state.currentPatient?.email }}
              </q-item-label>

              <q-item-label caption>Edad:</q-item-label>
              <q-item-label class="q-mb-xs">
                <q-skeleton type="text" v-if="state.showSkeleton" />{{
                  state.age
                }}
                <span v-if="!state.showSkeleton">
                  ({{ state.currentPatient?.dateBirth }})
                </span></q-item-label
              >

              <q-item-label caption>Genero:</q-item-label>
              <q-item-label class="q-mb-xs">
                <q-skeleton type="text" v-if="state.showSkeleton" />
                {{ state.currentPatient?.gender.description }}
              </q-item-label>
            </div>
          </div>
        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
</template>

<script setup lang="ts">
  import { inject, ref } from 'vue';
  import { InfoPatientPanelBloc } from 'src/Adapters';
  import { usePlocState } from 'src/Infraestructure/Utilities/usePlocState';
  // import { IHandleGlobalState } from 'src/Domine/IPatterns';
  // import { ClinicHistoryMediator } from 'src/Infraestructure/Mediators';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dependenciesLocator = inject<any>('dependenciesLocator');
  const controller = <InfoPatientPanelBloc>(
    dependenciesLocator.provideInfoPatientPanelPloc()
  );
  const expanded = ref<boolean>(false);
  // const handleGlobalState = <IHandleGlobalState>(
  //   dependenciesLocator.provideHandleGlobalState()
  // );
  const state = usePlocState(controller);
  // async function patientHasAppointment() {
  //   await controller.patientHasAppointment();
  // }
</script>
<!-- <style scoped>
  .my-card {
    width: 100%;
    max-width: 250px;
  }
</style> -->
