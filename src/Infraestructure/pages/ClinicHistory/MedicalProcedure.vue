<template>
  <div class="text-h5 q-mt-sm q-mb-xs">
    <q-icon :name="icons.physicalTherapy" size="32px" /> Examen Fisico
  </div>
  <div class="fit row wrap items-start">
    <q-list dense class="col-grow" style="overflow: auto">
      <div v-for="(item, index) in state.items" :key="item.id">
        <q-item clickable v-ripple :key="item.id" v-if="index % 2 == 0">
          <q-item-section side top>
            <q-input
              dense
              v-model="item.result"
              :rules="[required]"
              @blur="(evt) => updateValue(evt)"
              :label="item.description"
            />
          </q-item-section>
        </q-item>
      </div>
    </q-list>
    <q-list dense class="col-grow" style="overflow: auto">
      <div v-for="(item, index) in state.items" :key="item.id">
        <q-item clickable v-ripple :key="item.id" v-if="index % 2 != 0">
          <q-item-section side top>
            <q-input
              dense
              v-model="item.result"
              :rules="[required]"
              @blur="(evt) => updateValue(evt)"
              :label="item.description"
            />
          </q-item-section>
        </q-item></div
    ></q-list>
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted } from 'vue';
import { MedicalProcedureBloc } from 'src/Adapters/ClinicHistoryController';
import { IconSVG } from 'src/Application/Utilities';
import { required } from 'src/Application/Utilities/Helpers';
import { ClinicHistoryMediator } from 'src/Infraestructure/Mediators';
import { usePlocState } from 'src/Infraestructure/Utilities/usePlocState';

const icons = IconSVG;
const dependenciesLocator = inject<any>('dependenciesLocator');
const mediator = ClinicHistoryMediator.getInstance();
const controller = <MedicalProcedureBloc>(
  dependenciesLocator.provideMedicalProcedureBloc()
);
const state = usePlocState(controller);
mediator.add(controller);
onMounted(async () => {
  await controller.loadInitialData();
});
function updateValue(event: any) {
  controller.updateValue(event.target.value);
}
</script>
