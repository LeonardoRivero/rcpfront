<template>
  <!-- <div class="q-pa-md" style="max-width: 400px">
    <q-form @submit="validate" class="q-gutter-md" ref="formSpeciality">
      <q-input
        outlined
        v-model="description"
        label="Descripcion"
        hint="Descripcion Entidad"
        lazy-rules
        :rules="[
          (val) => (val && val.length > 0) || 'Descripcion es requerida',
        ]"
      />
      <div>
        <q-btn label="Submit" type="submit" color="primary" />
      </div>
    </q-form>
  </div> -->
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card" flat bordered>
      <q-card-section>
        <div class="text-h5 q-mt-sm q-mb-xs">Especialidades</div>
        <div class="text-caption text-grey">
          Especialidades existentes: {{ options.length }}
        </div>
        <q-select
          dense
          clearable
          outlined
          v-model="model"
          :options="options"
          option-value="id"
          option-label="description"
          map-options
          label="Especialidad"
          @update:model-value="(val) => specialityChanged(val)"
        >
          <!-- <template v-slot:selected>
            <div
              v-if="model"

              dense
              square
              color="white"
              text-color="primary"
              class="q-my-none q-ml-xs q-mr-none"
            >
              {{ model.description }}
            </div>
            <div v-else>Seleccione Especialidad</div>
          </template> -->
        </q-select>
      </q-card-section>
      <q-card-actions>
        <q-btn flat round color="primary" icon="mdi-plus" @click="add">
          <q-tooltip transition-show="scale" transition-hide="scale">
            Agregar
          </q-tooltip>
        </q-btn>
        <q-btn
          v-if="model != null"
          flat
          round
          color="green"
          icon="mdi-pencil"
          @click="edit"
        >
          <q-tooltip transition-show="scale" transition-hide="scale">
            Editar
          </q-tooltip>
        </q-btn>
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
          <q-card-section class="text-subitle2">
            <q-form @submit="validate" class="q-gutter-md" ref="formSpeciality">
              <q-input
                dense
                outlined
                v-model="currentSpeciality.description"
                label="Descripcion"
                hint="Descripcion Entidad"
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Descripcion es requerida',
                ]"
              />
              <div>
                <q-btn label="Guardar" type="submit" color="primary" />
              </div>
            </q-form>
          </q-card-section>
        </div>
      </q-slide-transition>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { QForm } from 'quasar';
import HttpStatusCodes from 'src/scripts/HttpStatusCodes';
import { useCounterStore } from 'src/stores/example-store';
import { ISpeciality, Specialities } from 'src/interfaces/IModels';

export default defineComponent({
  name: 'SpecialityForm',
  setup() {
    const store = useCounterStore();
    const router = useRouter();
    const formSpeciality = ref<QForm | null>(null);

    let options = ref(Array<ISpeciality>());
    let model = ref<ISpeciality>();
    let expanded = ref(false);
    let description = ref<string>('');
    let currentSpeciality = ref<ISpeciality>({} as ISpeciality);
    //let serviceSpecialities = ref<Specialities>({} as Specialities);

    async function validate() {
      let isValid = await formSpeciality.value?.validate();
      if (isValid == false) {
        return;
      }
      let speciality = currentSpeciality.value;
      const service = new Specialities();

      if (speciality.id == undefined) {
        service.add(speciality.description);
        // let data: Speciality = { description: speciality.description };
        // store.createSpeciality(data);
      }
      if (speciality.id != undefined) {
        // let data: Speciality = {
        //   id: speciality.id,
        //   description: speciality.description,
        // };
        // store.updateSpeciality(data);
        service.edit(speciality);
      }
    }

    async function add() {
      expanded.value = !expanded.value;
      //let data: Speciality = { id: undefined, description: '' };
      const service = new Specialities();
      currentSpeciality.value = service.default();
    }

    async function edit() {
      if (expanded.value === false) {
        expanded.value = !expanded.value;
      }
      currentSpeciality.value = model.value as ISpeciality;
      // let data = model.value;
      // console.log(data);
      // if (data == null) return;
      // let specialitySelected: Speciality = {
      //   id: data?.id,
      //   description: data.description,
      // };
      // currentSpeciality.value = specialitySelected;
      // description.value = data.description;
    }
    function specialityChanged(val: ISpeciality) {
      currentSpeciality.value = val;
      store.$patch((state) => {
        state.currentSpeciality = val;
      });
    }

    onMounted(async () => {
      if (store.allSpecialities == undefined) {
        const response = await store.retrieveAllSpecialities();
        options.value = response.parsedBody as Array<ISpeciality>;
        if (response.status == HttpStatusCodes.NOT_FOUND) {
          router.push('/:catchAll');
        }
      }
    });
    return {
      model,
      options,
      expanded,
      currentSpeciality,
      description,
      formSpeciality,
      validate,
      add,
      edit,
      specialityChanged,
    };
  },
});
</script>
<style lang="sass" scoped>
.my-card
  width: 100%
  min-width: 250px
  max-width: 250px
</style>
