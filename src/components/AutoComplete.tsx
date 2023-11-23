import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';
import './AutoComplete.scss';

type Props = {
  people: Person[]
  selectedPerson: Person | null
  onSelect?: (person: Person) => void;
  delay: number;
};

export const AutoComplete: React.FC<Props> = React.memo(({
  people,
  selectedPerson,
  onSelect = () => { },
  delay,
}) => {
  const [showList, setShowList] = useState(false);
  const [query, setQuery] = useState(selectedPerson?.name || '');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(
    (quiz) => debounce(setAppliedQuery, delay)(quiz),
    [setAppliedQuery, delay],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    return people.filter(person => person.name.toLocaleLowerCase()
      .includes(appliedQuery.toLocaleLowerCase()));
  }, [appliedQuery, people]);

  const peopleList = filteredPeople.length > 0 ? filteredPeople.map(person => (
    <button
      type="button"
      key={person.name}
      className="dropdown-item"
      onMouseDown={() => {
        onSelect(person);
        setQuery(person.name);
      }}
    >
      {person.name}
    </button>
  )) : (
    'No matching suggestions'
  );

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setShowList(true)}
          onBlur={() => setShowList(false)}
        />
      </div>

      {showList && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {peopleList}
          </div>
        </div>
      )}
    </div>
  );
});
