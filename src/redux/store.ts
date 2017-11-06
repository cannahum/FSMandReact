import { applyMiddleware, createStore, Store } from "redux";
import thunkMiddleware from "redux-thunk";
import rootReducer, { ReducerMap } from './reducers';

export default function configureStore(): Store<ReducerMap> {
  return createStore<ReducerMap>(
    rootReducer,
    (<any>window).__REDUX_DEVTOOLS_EXTENSION__ && (<any>window).__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(thunkMiddleware)
  );
}