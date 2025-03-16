import React, { useCallback, useMemo, useState } from 'react';
import { PersonList } from '../PersonList/PersonList';
import { peopleFromServer } from '../../data/people';
import { Person } from '../../types/Person';
import debounce from 'lodash.debounce';
import { ErrorPerson } from '../../types/Error';
import Error from '../Error/Error';
import classNames from 'classnames';

type Props = {
  delay?: number;
  onSelect: (title: Person | null) => void;
};

export const DropDown: React.FC<Props> = ({ delay = 300, onSelect }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isList, setIsList] = useState(false);
  const [error, setError] = useState<ErrorPerson>({
    isError: false,
    errorMessage: '',
  });

  const filteredPeople: Person[] = useMemo(() => {
    if (appliedQuery.trim() === '') {
      return peopleFromServer;
    }

    const people = peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.trim().toLowerCase()),
    );

    if (people.length === 0) {
      setError({ isError: true, errorMessage: 'No matching suggestions' });
    } else {
      setError({ isError: false, errorMessage: '' });
    }

    return people;
  }, [appliedQuery]);

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.trim().length > 0) {
      applyQuery(e.target.value);
    }

    onSelect(null);
  };

  const handleFocus = () => {
    setIsList(true);
  };

  return (
    <>
      <div
        className={classNames('dropdown', {
          'is-active': !error.isError,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleChange}
            onFocus={handleFocus}
          />
        </div>
        {isList && <PersonList people={filteredPeople} onSelect={onSelect} />}
      </div>
      {error.isError && <Error message={error.errorMessage} />}
    </>
  );
};

export default DropDown;
