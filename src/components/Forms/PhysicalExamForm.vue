<template>
  <div class="row">
    <div class="col-6 col-md-6 col-sm-12 col-xs-12">
      <q-form @submit="confirmChanges" ref="formPhysicalExam">
        <q-list style="max-width: 600px">
          <q-item>
            <q-item-section top>
              <small>
                <cite title="Ayuda"
                  >(Seleccione una especialidad a asociar con tu parametro del
                  examen fisico)</cite
                >
              </small>
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
                :rules="[(val) => val || 'Especialidad es requerida']"
                @clear="(val) => clearSpeciality(val)"
              >
              </q-select>
            </q-item-section>
          </q-item>
          <q-item>
            <!-- <q-item-section avatar top>
        <q-icon :name="icon" color="black" size="34px" />
      </q-item-section> -->
            <q-item-section top>
              <q-input
                v-model="parameterPhysicalExam.description"
                label="Parametro Examen Fisico"
                dense
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Parametro es requerido',
                ]"
              />
            </q-item-section>
            <q-item-section top side>
              <div class="text-grey-8 q-gutter-xs">
                <q-btn color="red" size="12px" flat dense round icon="delete">
                  <q-tooltip transition-show="scale" transition-hide="scale">
                    Eliminar
                  </q-tooltip>
                </q-btn>
                <q-btn
                  color="green"
                  size="12px"
                  flat
                  dense
                  round
                  type="submit"
                  icon="mdi-check-outline"
                >
                  <q-tooltip transition-show="scale" transition-hide="scale">
                    Confirmar
                  </q-tooltip>
                </q-btn>
                <q-btn size="12px" flat dense round icon="more_vert">
                  <q-menu>
                    <q-list style="min-width: 100px">
                      <q-item clickable v-close-popup>
                        <q-item-section>New tab</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup>
                        <q-item-section>New incognito tab</q-item-section>
                      </q-item>
                      <q-separator />
                      <q-item clickable v-close-popup>
                        <q-item-section>Recent tabs</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup>
                        <q-item-section>History</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup>
                        <q-item-section>Downloads</q-item-section>
                      </q-item>
                      <q-separator />
                      <q-item clickable v-close-popup>
                        <q-item-section>Settings</q-item-section>
                      </q-item>
                      <q-separator />
                      <q-item clickable v-close-popup>
                        <q-item-section>Help &amp; Feedback</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </q-item-section>
          </q-item>

          <!-- <q-separator spaced inset="item" /> -->

          <!-- <q-item>
        <q-item-section avatar top>
          <q-icon name="account_tree" color="black" size="34px" />
        </q-item-section>

        <q-item-section top class="col-2 gt-sm">
          <q-item-label class="q-mt-sm">GitHub</q-item-label>
        </q-item-section>

        <q-item-section top>
          <q-item-label lines="1">
            <span class="text-weight-medium">[quasarframework/quasar]</span>
            <span class="text-grey-8"> - GitHub repository</span>
          </q-item-label>
          <q-item-label caption lines="1">
            @rstoenescu in #1: > The build system
          </q-item-label>
          <q-item-label
            lines="1"
            class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase"
          >
            <span class="cursor-pointer">Open in GitHub</span>
          </q-item-label>
        </q-item-section>

        <q-item-section top side>
          <div class="text-grey-8 q-gutter-xs">
            <q-btn class="gt-xs" size="12px" flat dense round icon="delete" />
            <q-btn class="gt-xs" size="12px" flat dense round icon="done" />
            <q-btn size="12px" flat dense round icon="more_vert" />
          </div>
        </q-item-section>
      </q-item> -->
        </q-list>
      </q-form>
    </div>
    <div class="col-6 col-md-6 col-sm-12 col-xs-12">
      <q-list style="max-width: 600px">
        <q-item>
          <q-item-section top>
            <small>
              <cite title="Ayuda"
                >Despliegue la lista para consultar los parametros disponibles
                en su examen fisico</cite
              >
            </small>
            <q-select
              dense
              clearable
              outlined
              v-model="insurance"
              :options="allInsurance"
              option-value="id"
              option-label="nameInsurance"
              map-options
              label="Parametros Disponibles"
            >
            </q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { specialityService } from 'src/services/SpecialityService';
import { physicalExamService } from 'src/services/PhysicalExamService';
import * as Constants from 'src/scripts/Constants';
import 'src/css/app.sass';

export default defineComponent({
  name: 'PhysicalExamForm',
  setup() {
    const { allSpecialities, clearSpeciality, getAllSpecialities } =
      specialityService();
    const iconSVG = Constants.IconSVG.getInstance();
    const {
      parameterPhysicalExam,
      formPhysicalExam,
      icon,
      speciality,
      confirmChanges,
    } = physicalExamService();

    onMounted(async () => {
      await getAllSpecialities();
      icon.value = iconSVG.outpatient;
    });
    return {
      icon,
      parameterPhysicalExam,
      allSpecialities,
      speciality,
      formPhysicalExam,
      clearSpeciality,
      confirmChanges,
    };
  },
});
</script>
