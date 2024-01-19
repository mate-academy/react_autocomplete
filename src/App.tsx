import { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplite';
import { Title } from './components/Title';

export const App: React.FC = () => {
  // eslint-disable-next-line max-len
  const [isSelectedPerson, setIsSelectedPerson] = useState(false);

  return (
    <main className="section">
      <Title
        data={peopleFromServer}
        isSelected={isSelectedPerson}
      />

      <Autocomplete onSelected={() => setIsSelectedPerson(true)} />
    </main>
  );
};
