<template>
  <div>
    <div class="q-gutter-y-md">
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="Insurance" label="Entidades" />
          <q-tab name="Speciality" label="Especialidad" />
          <q-tab name="MedicalHistory" label="Historia Clinica" />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="Insurance">
            <div class="row">
              <div class="col-6 col-md-6 col-xs-12"><Insurance /></div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="Speciality">
            <div class="row">
              <div class="col-4 col-md-4 col-sm-12 col-xs-12">
                <SpecialityForm />
              </div>
              <div class="col-4 col-md-4 col-sm-12 col-xs-12">
                <DxMainCode />
              </div>
              <div class="col-4 col-md-4 col-sm-12 col-xs-12">
                <RelationCode />
              </div>
            </div>
          </q-tab-panel>
          <!-- <q-tab-panel name="MedicalHistory">
            <q-list>
              <q-expansion-item
                popup
                default-opened
                :icon="icon"
                :caption="PARAMETERS_PHYSICAL_EXAM"
                label="Examen Fisico"
              >
                <q-separator />
                <q-card>
                  <q-card-section>
                    <div class="row q-col-gutter-x-md">
                      <PhysicalExamForm />
                    </div>
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-expansion-item
                popup
                icon="send"
                label="Outbox"
                caption="Empty"
              >
                <q-separator />
                <q-card>
                  <q-card-section>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Quidem, eius reprehenderit eos corrupti commodi magni
                    quaerat ex numquam, dolorum officiis modi facere maiores
                    architecto suscipit iste eveniet doloribus ullam aliquid.
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-expansion-item
                popup
                icon="drafts"
                label="Draft"
                caption="Draft a new email"
              >
                <q-separator />
                <q-card>
                  <q-card-section>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Quidem, eius reprehenderit eos corrupti commodi magni
                    quaerat ex numquam, dolorum officiis modi facere maiores
                    architecto suscipit iste eveniet doloribus ullam aliquid.
                  </q-card-section>
                </q-card>
              </q-expansion-item>
            </q-list>
          </q-tab-panel> -->
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import SpecialityForm from './SpecialityForm.vue';
import DxMainCode from './DxMainCodeForm.vue';
import RelationCode from './RelationCode.vue';
import Insurance from './InsuranceForm.vue';
import PhysicalExamForm from './PhysicalExamForm.vue';
import { IconSVG } from 'src/Application/Utilities/Constants';

export default defineComponent({
  components: {
    SpecialityForm,
    DxMainCode,
    RelationCode,
    Insurance,
    // PhysicalExamForm,
  },

  setup() {
    const iconSVG = IconSVG.getInstance();
    const icon = ref('');
    const PARAMETERS_PHYSICAL_EXAM = ref<string>('');
    // const r = ref();
    // const table = ref<TableOptions>();
    // const { allSpecialities } = storeToRefs(useStoreSpeciality());

    onMounted(async () => {
      icon.value = iconSVG.outpatient;
      PARAMETERS_PHYSICAL_EXAM.value =
        'En esta seccion puedes modificar los parametros que desea implementar en su examen fisico';

      // r.value = allSpecialities.value.map((row: ISpeciality) => ({
      //   id: row.id,
      //   description: row.description,
      // }));

      // const pp = new TableOptions(columnsPrueba, r);
      // pp.selectionRow = 'none' as SelectionType;
      // pp.title = 'Nueva Tabla';
      // pp.enableSelect = true;
      // pp.enableSearch = true;
      // const optionsSelect = new TableSelect();
      // optionsSelect.listOptions = allSpecialities.value;
      // optionsSelect.optionValue = 'id';
      // optionsSelect.optionLabel = 'description';
      // pp.setSelect(optionsSelect);
      // table.value = pp;
    });

    return {
      tab: ref('MedicalHistory'),
      splitterModel: ref(20),
      PARAMETERS_PHYSICAL_EXAM,
      icon,
    };
  },
});
</script>
<style lang="sass" scoped>
.row > div
  padding: 5px 5px
.row + .row
  margin-top: 1rem
</style>
