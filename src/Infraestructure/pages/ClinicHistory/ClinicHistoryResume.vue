<template>
  <q-list bordered class="rounded-borders bg-white">
    <div v-for="item in items" :key="item.year">
      <q-expansion-item
        expand-separator
        :icon="icons.historyLog"
        :label="`Año:${item.year}`"
        :caption="`Total visitas:${item.results.length.toString()}`"
        :default-opened="false"
      >
        <div v-for="resultado in item.results" :key="resultado._id">
          <q-expansion-item
            :header-inset-level="1"
            expand-separator
            icon="receipt"
            :label="new Date(resultado.date_exam).toLocaleString('es-CO')"
            :default-opened="false"
            :content-inset-level="1.5"
          >
            <q-card>
              <q-card-section>
                <div v-for="(result, index) in resultado.result" :key="index">
                  <p>
                    <b>Examen:</b> {{ result.description }} <b>Resultado:</b
                    >{{ result.result }}
                  </p>
                </div>
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </div>
      </q-expansion-item>
    </div>
  </q-list>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { IconSVG } from 'src/Application/Utilities';
import { ClinicHistoryResumeController } from 'src/Adapters/ClinicHistoryController';
import { PhysicalExamResume } from 'src/Domine/Types';

export default defineComponent({
  name: 'ClinicHistoryResume',
  setup() {
    // const items = ref<Array<PhysicalExamResultResponse>>([]);
    const items = ref<Array<PhysicalExamResume>>([]);
    const message = ref<string>('');
    onMounted(async () => {
      const controller = new ClinicHistoryResumeController();
      const response = await controller.getAll();
      items.value = controller.adaptObject(response);
      console.log(items.value);
    });
    return {
      items,
      icons: IconSVG,
    };
  },
});
</script>
