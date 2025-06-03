import cn from 'classnames';
import { useCallback, useState } from 'react';
import { peopleFromServer } from '../../../data/people';
import debounce from 'lodash.debounce';
// eslint-disable-next-line max-len
import { preparedVisiblePeople } from '../../../utilities/preparedVisiblePeople';
import { Person } from '../../../types/Person';

const delay = 300;

interface DropdownProps {
  selectedPerson: Person | null;
  onSelected: (person: Person | null) => void;
}

export const Dropdown = ({ selectedPerson, onSelected }: DropdownProps) => {
  const [query, setQuery] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');
  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const visiblePeople = preparedVisiblePeople(peopleFromServer, appliedQuery);

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trimStart();

    setQuery(value);
    applyQuery(value);
    onSelected(null);
  };

  return (
    <div className={cn({ 'dropdown is-active': isFocus })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder={
            selectedPerson ? selectedPerson.name : 'Enter a part of the name'
          }
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleQuery}
          onFocus={() => setIsFocus(true)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {visiblePeople.length > 0 ? (
            visiblePeople.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                  onSelected(person), setIsFocus(false);
                }}
              >
                <p
                  className={cn({
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                >
                  {person.name}
                </p>
              </div>
            ))
          ) : (
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
        </div>
      </div>
    </div>
  );
};
