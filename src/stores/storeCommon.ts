import { ref } from 'vue';
import { defineStore } from 'pinia';
import { IColumnsDataTable } from 'src/interfaces/ICommons';

export const useStoreModal = defineStore('modal', {
  state: () => ({
    title: ref<string>(''),
    urlToRedirect: ref<string>(''),
    visible: ref(false),
    redirect: ref(false),
    objetToShow: ref<string>(),
    columnsTable: ref<Array<IColumnsDataTable>>(),
    dataToShow: ref<unknown>(),
  }),
  actions: {
    // setTitle(title: string): void {
    //   this.title = title;
    // },
    // withRedirect(url: string): void {
    //   this.urlToRedirect = url;
    //   this.redirect = true;
    // },
    // showModal(show: boolean): void {
    //   this.visible = show;
    // },
  },
});
