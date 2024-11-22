<template>
  <div class="q-pa-md" v-if="!visible">
    <q-item>
      <q-item-section avatar>
        <q-skeleton type="QAvatar" />
      </q-item-section>

      <q-item-section>
        <q-item-label>
          <q-skeleton type="text" />
        </q-item-label>
        <q-item-label caption>
          <q-skeleton type="text" width="65%" />
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section avatar>
        <q-skeleton type="QAvatar" />
      </q-item-section>

      <q-item-section>
        <q-item-label>
          <q-skeleton type="text" />
        </q-item-label>
        <q-item-label caption>
          <q-skeleton type="text" width="90%" />
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section avatar>
        <q-skeleton type="QAvatar" />
      </q-item-section>

      <q-item-section>
        <q-item-label>
          <q-skeleton type="text" width="35%" />
        </q-item-label>
        <q-item-label caption>
          <q-skeleton type="text" />
        </q-item-label>
      </q-item-section>
    </q-item>
  </div>

  <q-list bordered class="rounded-borders bg-white" v-if="visible">
    <div v-for="item in items" :key="item.year">
      <q-expansion-item
        expand-separator
        :icon="icons.open_book"
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
<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import { IconSVG } from 'src/Application/Utilities';
import { ClinicHistoryResumeController } from 'src/Adapters/ClinicHistoryController';
import { PhysicalExamResume } from 'src/Domine/Types';
import { IFactoryMethodNotifications } from 'src/Domine/IPatterns';
// import { Container } from 'inversify';

const items = ref<Array<PhysicalExamResume>>([]);
const message = ref<string>('');
const visible = ref<boolean>(false);
// const containerDependency = inject<Container>('containerInversify');
// if (containerDependency === undefined) {
//   throw new Error('Container Injection undefine');
// }
const factoryNotificator = {} as IFactoryMethodNotifications;
const controller = new ClinicHistoryResumeController(factoryNotificator);
onMounted(async () => {
  const response = await controller.getAll();
  items.value = controller.adaptObject(response);
  visible.value = response.length != 0;
});

const icons = IconSVG;
</script>
