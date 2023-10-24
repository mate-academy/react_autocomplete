import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import './Autocomplete.scss';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay: number;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected = () => {},
  delay,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isDisplayedList, setІsDisplayedList] = useState(false);
  // eslint-disable-next-line
  const applyQuery = useCallback(
    debounce((value) => {
      setAppliedQuery(value.trim() !== '' ? value : '');
      setІsDisplayedList(true);
    }, delay),
    [setAppliedQuery],
  );

  const filteredPeople = useMemo(() => {
    return people.filter(person => person
      .name.toLowerCase().includes(appliedQuery.trim().toLowerCase()));
  }, [appliedQuery, people]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    setІsDisplayedList(false);

    setQuery(newQuery);
    applyQuery(newQuery);
  };

  const handleSelected = (person: Person) => {
    onSelected(person);
    setQuery(person.name);
    setAppliedQuery(person.name);
    setІsDisplayedList(false);
  };

  return (
    <div
      className={classNames('dropdown', {
        'is-active': isDisplayedList,
      })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setІsDisplayedList(true)}
          onBlur={() => setІsDisplayedList(false)}
        />
      </div>

      {isDisplayedList && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {!filteredPeople.length ? (
              <div className="dropdown-item">
                <p>No matching suggestions</p>
              </div>
            ) : (
              filteredPeople.map(person => (
                <div
                  className="dropdown-item dropdown-item--person"
                  key={person.slug}
                  role="button"
                  tabIndex={0}
                  onMouseDown={() => handleSelected(person)}
                  onKeyDown={() => handleSelected(person)}
                >
                  <hr className="dropdown-divider" />
                  <p className={classNames({
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                  >
                    {person.name}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
