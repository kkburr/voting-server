import makeStore from './src/store';
import { startServer } from './src/server';

export const store = makeStore();
startServer(store);

store.dispatch({
  type: 'SET_ENTRIES',
  entries: require('./entries.json')
});
store.dispatch({
  type: 'SET_ROUTES',
  routes: require('./routes.json')
});
store.dispatch({ type: 'NEXT '});
