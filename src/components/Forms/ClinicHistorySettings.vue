<template>
  <q-list style="max-width: 600px">
    <q-item>
      <q-item-section avatar top>
        <q-icon name="img:outpatient.svg" color="black" size="34px" />
      </q-item-section>
      <q-item-section top>
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
        >
        </q-select>
      </q-item-section>

      <q-item-section top side>
        <div class="text-grey-8 q-gutter-xs">
          <q-btn color="red" size="12px" flat dense round icon="delete" />
          <q-btn
            color="green"
            size="12px"
            flat
            dense
            round
            icon="mdi-check-outline"
          />
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
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import * as Constants from 'src/scripts/Constants';
import 'src/css/app.sass';

export default defineComponent({
  name: 'ClinicHistorySettings',
  setup() {
    const iconSVG = Constants.IconSVG.getInstance();

    return {
      icon: iconSVG.outpatient,
    };
  },
});
</script>
