import { Bloc } from 'src/Domine/IPatterns';
import { onMounted, onUnmounted, Ref, ref } from 'vue';

export function usePlocState<S>(bloc: Bloc<S>): Ref<S> {
  const state = ref(bloc.state) as Ref<S>;

  const stateSubscription = (newState: S) => {
    state.value = newState;
  };

  onMounted(() => {
    bloc.subscribe(stateSubscription);
  });

  onUnmounted(() => {
    bloc.unsubscribe(stateSubscription);
  });

  return state;
}
