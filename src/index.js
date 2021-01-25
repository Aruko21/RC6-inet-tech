import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import App from './components/App/App';
import store from './store';

// StrictMode - компонент-обертка, на основе чего ничего не рендерится
// Основное предназначение - чтобы ошибки провериль более точечно?
// Ниже - JSX синтаксис (за ним кроется вызов React.crateElement)
// Provider подключает приложение к store
ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
          <App />
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);


