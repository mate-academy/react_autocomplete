import React, { useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './components/Autocomplete/Autocomplete';

const NO_SELECTED_PERSON = 'No selected person';

export const App: React.FC = () => {
  const [peopleTarget, setPeopleTarget] = useState<number | null>(null);
  const [appliedQuery, setAppliedQuery] = useState('');

  const { name, born, died } = peopleFromServer[peopleTarget ?? 0];

  const filterList = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.trim().toLowerCase()),
    );
  }, [appliedQuery]);

  const handlePeopleSelect = (event: string | null) => {
    if (event === null) {
      setPeopleTarget(null);

      return;
    }

    const select = peopleFromServer.findIndex(person => person.name === event);

    setPeopleTarget(select);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {peopleTarget === null
            ? NO_SELECTED_PERSON
            : `${name} (${born} - ${died})`}
        </h1>

        <Autocomplete
          people={filterList}
          onSearch={setAppliedQuery}
          delay={300}
          onSelected={handlePeopleSelect}
        />
      </main>
    </div>
  );
};
