import { boot } from 'quasar/wrappers';

let routerInstance = null;
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(({ router }) => {
  // something to do
  routerInstance = router;
});
export { routerInstance };
