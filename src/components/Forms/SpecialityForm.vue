<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card" flat bordered>
      <q-card-section>
        <div class="text-h5 q-mt-sm q-mb-xs">Especialidades</div>
        <div class="text-caption text-grey">
          Especialidades existentes:
          {{ allSpecialities == null ? '' : allSpecialities.length }}
        </div>
        <q-select
          dense
          clearable
          outlined
          v-model="speciality"
          :options="allSpecialities"
          option-value="id"
          option-label="description"
          map-options
          label="Especialidad"
          @update:model-value="(val) => specialityChanged(val)"
          @clear="(val) => clearSpeciality(val)"
        >
        </q-select>
      </q-card-section>
      <q-card-actions>
        <q-btn flat round color="primary" icon="mdi-plus" @click="add">
          <q-tooltip transition-show="scale" transition-hide="scale">
            Agregar
          </q-tooltip>
        </q-btn>
        <q-btn
          v-if="speciality != null"
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
            <q-form
              @submit="confirmChanges"
              class="q-gutter-md"
              ref="formSpeciality"
            >
              <q-input
                dense
                outlined
                v-model="currentSpeciality.description"
                label="Descripcion"
                hint="Descripcion Especialidad"
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
import { defineComponent, onMounted } from 'vue';
// import { QForm } from 'quasar';
// import { ISpeciality, IDXMainCodeRequest } from 'src/interfaces/IModels';
// import { Specialities, DXMainCode } from 'src/services/SettingsService';
import { useSpeciality } from 'src/services/Speciality';
import { ISpeciality } from 'src/interfaces/IModels';

export default defineComponent({
  name: 'SpecialityForm',
  setup() {
    // const formSpeciality = ref<QForm | null>(null);
    const {
      allSpecialities,
      getAllSpecialities,
      currentSpeciality,
      speciality,
      expanded,
      formSpeciality,
      specialityChanged,
      add,
      edit,
      confirmChanges,
      clearSpeciality,
    } = useSpeciality();
    // async function specialityClear(val: ISpeciality) {
    //   console.log(val);
    // }

    // let expanded = ref(false);
    //let currentSpeciality = ref<ISpeciality>({} as ISpeciality);
    // const service = new Specialities();

    //async function validate() {
    // let isValid = await formSpeciality.value?.validate();
    // if (isValid == false) {
    //   return;
    // }
    // let speciality = currentSpeciality.value;
    // if (speciality.id == undefined) {
    //   service.add(speciality.description);
    // }
    // if (speciality.id != undefined) {
    //   service.edit(speciality);
    // }
    //}
    // function add() {
    //   expanded.value = !expanded.value;
    //   currentSpeciality.value = service.getDefault();
    // }
    // function edit() {
    //   if (expanded.value === false) {
    //     expanded.value = !expanded.value;
    //   }
    //   currentSpeciality.value = speciality.value as ISpeciality;
    // }
    // function specialityChanged(val: ISpeciality) {
    //   currentSpeciality.value = val;
    //   const serviceDxMainCode = new DXMainCode();
    //   service.setCurrent(val);
    //   serviceDxMainCode.setCurrent({} as IDXMainCodeRequest);
    //   // store.$patch((state) => {
    //   //   state.currentSpeciality = val;
    //   //   state.currentDxMainCodeTest = {} as IDXMainCodeRequest;
    //   // });
    // }
    onMounted(async () => {
      // await service.getAll();
      getAllSpecialities;
    });
    return {
      expanded,
      speciality,
      allSpecialities,
      add,
      edit,
      currentSpeciality,
      formSpeciality,
      confirmChanges,
      specialityChanged,
      clearSpeciality,
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
