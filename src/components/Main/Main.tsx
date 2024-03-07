import { useCallback, useState } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';
import { Dropdown } from '../Dropdown';

type Props = {
  people: Person[];
};

export const Main: React.FC<Props> = ({ people }) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const filteredPeople = people.filter(({ name }) =>
    name.toLowerCase().includes(appliedQuery.toLowerCase()),
  );

  const isMatched = filteredPeople.length > 0;

  return (
    <main className="section is-flex is-flex-direction-column">
      <h1 className="title" data-cy="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <Dropdown
        selectPerson={setSelectedPerson}
        applyQuery={applyQuery}
        filteredPeople={filteredPeople}
        isMatched={isMatched}
      />

      {!isMatched && (
        <div
          className="
          notification
          is-danger
          is-light
          mt-3
          is-align-self-flex-start
          "
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </main>
  );
};
