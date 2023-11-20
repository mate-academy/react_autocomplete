import ReactDOM from 'react-dom';

import 'bulma/css/bulma.css';
import { App } from './components/App/App';
import { AutocompleteProvider }
  from './components/Autocomplete/AutocompleteContext';

ReactDOM.render(
  <AutocompleteProvider>
    <App />
  </AutocompleteProvider>,
  document.getElementById('root'),
);
