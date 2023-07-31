import {
  FC, useCallback, useMemo, useState,
} from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

import { peopleFromServer } from '../data/people';
import { debounce } from '../helpers/debounce';

type Props = {
  delay: number;
  onSelected: (person: Person) => void;
};

export const Autocomplete: FC<Props> = ({
  delay,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const filteredPersons = useMemo(() => {
    return appliedQuery
      ? peopleFromServer.filter(person => person.name.toLowerCase()
        .includes(appliedQuery.toLowerCase()))
      : [];
  }, [peopleFromServer, appliedQuery]);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const handlerInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const onSelectPerson = (person: Person) => () => {
    setQuery(person.name);
    setAppliedQuery('');
    onSelected(person);
  };

  const onPressKey = (person: Person) => {
    return (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter') {
        setQuery(person.name);
        setAppliedQuery('');
        onSelected(person);
      }
    };
  };

  return (
    <div
      className={classNames(
        'dropdown',
        { 'is-active': appliedQuery },
      )}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          autoComplete="off"
          value={query}
          onChange={handlerInput}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPersons.length
            ? filteredPersons.map(person => (
              <div
                role="button"
                tabIndex={0}
                className="dropdown-item"
                key={person.slug}
                onClick={onSelectPerson(person)}
                onKeyUp={onPressKey(person)}
              >
                <p
                  className={person.sex === 'm'
                    ? 'has-text-link'
                    : 'has-text-danger'}
                >
                  {person.name}
                </p>
              </div>
            ))
            : (
              <div className="dropdown-item">
                No matching suggestions
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
