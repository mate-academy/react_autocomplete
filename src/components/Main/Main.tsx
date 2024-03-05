import { useState } from 'react';
import { Person } from '../../types/Person';
import { Dropdown } from '../Dropdown';

type Props = {
  people: Person[];
};

export const Main: React.FC<Props> = ({ people }) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isMatched, setIsMatched] = useState(true);

  return (
    <main className="section is-flex is-flex-direction-column">
      <h1 className="title" data-cy="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <Dropdown
        people={people}
        selectPerson={setSelectedPerson}
        setIsMatched={setIsMatched}
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
