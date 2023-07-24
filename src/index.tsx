import ReactDOM from 'react-dom';
import 'bulma/css/bulma.css';
import { App } from './App';
import { PeopleProvider } from './contexts/PeopleContexts';

ReactDOM.render(
  <PeopleProvider>
    <App />
  </PeopleProvider>,
  document.getElementById('root'),
);
