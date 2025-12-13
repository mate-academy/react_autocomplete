import './App.scss';
import 'bulma/css/bulma.min.css';

import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <Autocomplete people={peopleFromServer} delay={300} />
      </main>
    </div>
  );
};
