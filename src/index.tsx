import ReactDOM from 'react-dom';
import { PeopleProvider } from './contexts/PeopleContext';
import { App } from './App';

ReactDOM.render(
  <PeopleProvider>
    <App />
  </PeopleProvider>,
  document.getElementById('root'),
);
