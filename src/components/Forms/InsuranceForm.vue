<template>
  <div class="q-pa-md">
    <q-card class="my-card" bordered>
      <q-card-section>
        <div class="text-h5 q-mt-sm q-mb-xs">Entidades</div>
        <div class="text-caption text-grey">
          Entidades Registradas:
          {{ allInsurance == null ? '' : allInsurance.length }}
        </div>
        <q-select
          dense
          clearable
          outlined
          v-model="insurance"
          :options="allInsurance"
          option-value="id"
          option-label="nameInsurance"
          map-options
          label="Descripcion"
          @update:model-value="(val) => insuranceChanged(val)"
          @clear="(val) => clearInsurance(val)"
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
          v-if="insurance != null"
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
            <q-form @submit="confirmChanges" ref="formInsurance">
              <q-input
                dense
                outlined
                v-model="currentInsurance.entityCode"
                label="Codigo Entidad"
                maxlength="10"
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Codigo es requerido',
                ]"
              />
              <q-input
                dense
                outlined
                v-model="currentInsurance.nameInsurance"
                label="Descripcion Entidad"
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
import { useInsurance } from 'src/services/InsuranceService';
export default defineComponent({
  name: 'InsuranceForm',
  setup() {
    const {
      currentInsurance,
      insurance,
      expanded,
      formInsurance,
      error,
      insuranceChanged,
      clearInsurance,
      edit,
      add,
      confirmChanges,
      getAllInsurance,
      allInsurance,
    } = useInsurance();

    onMounted(async () => {
      getAllInsurance();
    });
    return {
      insurance,
      clearInsurance,
      insuranceChanged,
      allInsurance,
      currentInsurance,
      expanded,
      formInsurance,
      error,
      edit,
      add,
      confirmChanges,
    };
  },
});
</script>
<style lang="sass" scoped>
.my-card
    box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.2)
    transition: all ease 0.2s

.my-card:hover
    transition: all ease 0.2s
    box-shadow: inherit
    box-shadow: 5px 5px 20px 5px rgba(0,0,0,0.3)
</style>
