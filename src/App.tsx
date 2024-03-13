import './App.scss';

import { Autocomplete } from './components/Autocomplete';

export const App: React.FC = () => {
  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <Autocomplete />
      </main>
    </div>
  );
};
