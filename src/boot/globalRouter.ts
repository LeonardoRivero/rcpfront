import { boot } from 'quasar/wrappers';
import { Router } from 'vue-router';

let routerInstance: Router;
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ router }) => {
  // something to do
  routerInstance = router;
});
export { routerInstance };
