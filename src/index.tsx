import { createRoot } from 'react-dom/client';

import 'bulma/css/bulma.css';
import { App, Person } from './App';
import { peopleFromServer } from './data/people';

const handlePersonSelected = (person: Person) => {
  // eslint-disable-next-line no-console
  console.log('Selected Person:', person);
};

createRoot(document.getElementById('root') as HTMLDivElement).render(
  <App people={peopleFromServer} onSelected={handlePersonSelected} />,
);
