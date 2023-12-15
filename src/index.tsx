import ReactDOM from 'react-dom';
import 'bulma/css/bulma.css';
import { App } from './App';

ReactDOM.render(
  <App queryDelay={500} />,
  document.getElementById('root'),
);
