import { useCallback, useMemo, useState } from 'react';
import { PeopleList } from './PeopleList';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';
import { peopleFromServer } from '../data/people';

export const Autocomplete: React.FC = () => {
  const [query, setQuery] = useState('');
  const [applQuery, setApplQuery] = useState('');
  const [hasMatch, setHasMatch] = useState(true);
  const [person, setPerson] = useState<Person | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const applyQuery = useCallback(debounce(setApplQuery, 1000), []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value.toLowerCase().trim());
  };

  const filtredPeople = useMemo(() => {
    const filtredList = peopleFromServer.filter(p =>
      p.name.toLowerCase().includes(applQuery),
    );

    if (filtredList.length === 0) {
      setHasMatch(false);
    } else {
      setHasMatch(true);
    }

    setPerson(null);

    return filtredList;
  }, [applQuery]);

  const choosPerson = (p: Person) => {
    setPerson(p);
    setIsFocused(false);
  };

  return (
    <>
      <h1 className="title" data-cy="title">
        {person
          ? `${person.name} (${person.born} - ${person.died})`
          : 'No selected person'}
      </h1>
      <div className={`dropdown ${isFocused ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <input
            type="text"
            value={query}
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleInputChange}
          />
        </div>

        <PeopleList people={filtredPeople} onAdd={choosPerson} />
      </div>

      {!hasMatch ? (
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
      ) : (
        ''
      )}
    </>
  );
};
