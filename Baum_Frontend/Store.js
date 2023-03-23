// store.js
import React, {createContext, useReducer} from 'react';

const initialState = {};
const store = createContext(initialState);
const { Provider } = store;

const URLStateProvider = ( { children } ) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch(action.type) {
      case 'UPDATE_URL':
        return {url:action.payload};
      default:
        throw new Error();
    };
  }, initialState);

  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, URLStateProvider }