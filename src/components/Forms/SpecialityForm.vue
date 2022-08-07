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
import { defineComponent } from 'vue';
import { useSpeciality } from 'src/services/SpecialityService';

export default defineComponent({
  name: 'SpecialityForm',
  setup() {
    const {
      allSpecialities,
      //getAllSpecialities,
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
