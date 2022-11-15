<template>
  <div>
    <q-splitter v-model="splitterModel" style="min-width: 40em">
      <template v-slot:before>
        <div class="q-pa-md">
          <q-tree
            :nodes="simple"
            node-key="label"
            selected-color="primary"
            v-model:selected="selected"
            default-expand-all
          />
        </div>
      </template>

      <template v-slot:after>
        <q-tab-panels
          v-model="selected"
          animated
          transition-prev="jump-up"
          transition-next="jump-up"
          style="width: 100%"
        >
          <q-tab-panel name="Relax Hotel">
            <div class="text-h4 q-mb-md">Introduccion</div>
            <p>
              Aca se deberia explicar la funcionalidad de la seccion
              sadasdadasdasdsadsadasd asdadasd sfsdfsdfsdf asdsada asdasdasdas
            </p>
          </q-tab-panel>

          <q-tab-panel name="Examen Fisico">
            <div class="text-h4 q-mb-md">Examen Fisico</div>
            <ClinicHistorySettings />
          </q-tab-panel>

          <q-tab-panel name="Room service">
            <div class="text-h4 q-mb-md">Room service</div>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
              praesentium cumque magnam odio iure quidem, quod illum numquam
              possimus obcaecati commodi minima assumenda consectetur culpa fuga
              nulla ullam. In, libero.
            </p>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
              praesentium cumque magnam odio iure quidem, quod illum numquam
              possimus obcaecati commodi minima assumenda consectetur culpa fuga
              nulla ullam. In, libero.
            </p>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
              praesentium cumque magnam odio iure quidem, quod illum numquam
              possimus obcaecati commodi minima assumenda consectetur culpa fuga
              nulla ullam. In, libero.
            </p>
          </q-tab-panel>

          <q-tab-panel name="Room view">
            <div class="text-h4 q-mb-md">Room view</div>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
              praesentium cumque magnam odio iure quidem, quod illum numquam
              possimus obcaecati commodi minima assumenda consectetur culpa fuga
              nulla ullam. In, libero.
            </p>
            <p>
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis
              praesentium cumque magnam odio iure quidem, quod illum numquam
              possimus obcaecati commodi minima assumenda consectetur culpa fuga
              nulla ullam. In, libero.
            </p>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import ClinicHistorySettings from 'src/components/Forms/ClinicHistorySettings.vue';
export default defineComponent({
  components: {
    ClinicHistorySettings,
  },
  setup() {
    return {
      splitterModel: ref(40),
      selected: ref('Food'),

      simple: [
        {
          label: 'Relax Hotel',
          children: [
            {
              label: 'Examen Fisico',
              icon: 'mdi-arrow-right-bold',
            },
            {
              label: 'Room service',
              icon: 'room_service',
            },
            {
              label: 'Room view',
              icon: 'photo',
            },
          ],
        },
      ],
    };
  },
});
</script>
