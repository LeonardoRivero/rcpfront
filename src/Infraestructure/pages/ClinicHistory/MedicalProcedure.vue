<template>
  <div class="text-h5 q-mt-sm q-mb-xs">
    <q-icon :name="icons.physicalTherapy" size="32px" /> Examen Fisico
  </div>
  <q-splitter v-model="splitterModel">
    <template v-slot:before>
      <div v-for="(item, index) in state.items" :key="item.id">
        <q-item v-if="index % 2 == 0">
          <q-item-section>
            <q-item-label>{{ item.description }}</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-input dense v-model="item.result" :rules="[required]" />
          </q-item-section>
        </q-item>
      </div>
    </template>
    <template v-slot:after>
      <div v-for="(item, index) in state.items" :key="item.id">
        <q-item v-if="index % 2 != 0">
          <q-item-section>
            <q-item-label>{{ item.description }}</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-input dense v-model="item.result" :rules="[required]" />
          </q-item-section>
        </q-item>
      </div>
    </template>
  </q-splitter>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { IconSVG } from 'src/Application/Utilities';
import { MedicalProcedureState } from 'src/Domine/IStates';
import { required } from 'src/Application/Utilities/Helpers';
import { IFactoryMethodNotifications } from 'src/Domine/IPatterns';
import container from 'src/inversify.config';

const factoryNotificator =
  container.get<IFactoryMethodNotifications>('FactoryNotifactors');
let state: MedicalProcedureState = reactive({
  items: [],
});

const icons = IconSVG;
const splitterModel = 50;
</script>
