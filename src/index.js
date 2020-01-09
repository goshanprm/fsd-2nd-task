import './js';
import './assets/sass/main.sass';

const importAll = (r) => {
  r.keys().forEach(r);
};

importAll(require.context('./pug/', true, /\.(js|sass)$/));
