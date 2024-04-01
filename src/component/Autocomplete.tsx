import React, { useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import './Autocomplete.scss';
import { Person } from '../types/Person';

interface AutocompleteType {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
  selectedPerson: Person | null;
}

export const Autocomplete: React.FC<AutocompleteType> = ({
  onSelected,
  people,
  delay,
  selectedPerson,
}) => {
  const [openList, setOpenList] = useState(false);

  const [search, setSearch] = useState('');
  const [request, setRequest] = useState('');

  const shownPeople = useMemo(() => {
    return people.filter(person =>
      person.name.toLowerCase().includes(request.toLowerCase().trim()),
    );
  }, [request, people]);

  const applySearch = useMemo(
    () => debounce(setRequest, delay),
    [setRequest, delay],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    applySearch(e.target.value);
    setOpenList(true);
    onSelected(null);
  };

  const handleSelectedPeople = (person: Person) => {
    setSearch(person.name);
    onSelected(person);
    setOpenList(false);
  };

  const handleCancelValue = () => {
    setSearch('');
    applySearch('');
    onSelected(null);
  };

  return (
    <>
      <div
        className={classNames('dropdown', {
          'is-active': openList,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            value={search}
            onChange={handleChange}
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            onFocus={() => setOpenList(true)}
            onBlur={() => setOpenList(false)}
          />
          {search === selectedPerson?.name && (
            <button
              className="delete is-small"
              onClick={() => handleCancelValue()}
            ></button>
          )}
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div
            className={classNames({
              'dropdown-content': shownPeople.length !== 0,
            })}
          >
            {shownPeople.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.name}
                onMouseDown={() => handleSelectedPeople(person)}
              >
                <p
                  className={classNames('person', {
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                    'is-selected': person.name === selectedPerson?.name,
                  })}
                >
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {shownPeople.length === 0 && (
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
    </>
  );
};
