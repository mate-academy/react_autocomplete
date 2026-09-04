import { createRoot } from 'react-dom/client';
import { Person } from './types/Person';

import 'bulma/css/bulma.css';
import { App } from './App';

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <App
    onSelected={(person: Person) => {
      // eslint-disable-next-line no-console
      console.log(person);
    }}
  />,
);
