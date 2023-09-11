import { useState, useCallback } from 'react';
import cn from 'classnames';
import './Autocomplete.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from '../../data/people';
import { Person } from '../../types/Person';

const MALE_SEX = 'm';
const FEMALE_SEX = 'f';
const DEFAULT_DELAY = 700;

type Props = {
  getSelectedUser: (person: Person) => void
};

export const Autocomplete: React.FC<Props> = ({ getSelectedUser }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setApplyQuery] = useState('');
  const [isDropdownActive, setIsDropdownActive] = useState(false);

  const filteredPeople = peopleFromServer.filter(person => {
    const preparedPersonName = person.name.trim().toLowerCase();
    const preparedQuery = appliedQuery.trim().toLowerCase();

    return preparedPersonName.includes(preparedQuery);
  });

  const applyQuery = useCallback(debounce(setApplyQuery, DEFAULT_DELAY), []);

  const handleInputQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const resetInput = () => {
    setApplyQuery('');
    setQuery('');
  };

  return (
    <div className={
      cn('dropdown', {
        'is-active': isDropdownActive,
      })
    }
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleInputQuery}
          onClick={() => setIsDropdownActive(true)}
          onBlur={() => setIsDropdownActive(false)}
        />
        {query && (
          <button
            type="button"
            className="button is-danger"
            onClick={resetInput}
          >
            X
          </button>
        )}

      </div>
      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPeople.length
            ? (filteredPeople.map((person: Person) => (
              <div className="dropdown-item" key={person.slug}>
                <a
                  href="/"
                  className={cn({
                    'has-text-link': person.sex === MALE_SEX,
                    'has-text-danger': person.sex === FEMALE_SEX,
                  })}
                  onMouseDown={() => {
                    getSelectedUser(person);
                    setQuery(person.name);
                    setIsDropdownActive(false);
                  }}
                >
                  {person.name}
                </a>
              </div>
            )))
            : 'No matching suggestions '}
        </div>
      </div>
    </div>
  );
};
