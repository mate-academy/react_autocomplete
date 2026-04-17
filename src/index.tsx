import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import { App } from './App';
import { peopleFromServer } from './data/people';

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <App persons={peopleFromServer} />,
);
