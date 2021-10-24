import App from './components/app.js';

import { store } from './store/store.js';

window.addEventListener('DOMContentLoaded', () => {
  new App(store);
});
