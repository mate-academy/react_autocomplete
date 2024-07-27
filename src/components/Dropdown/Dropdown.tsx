import React, { useCallback, useMemo, useState } from 'react';
import './Dropdown.scss';
import debounce from 'lodash.debounce';
import cn from 'classnames';
import { peopleFromServer } from '../../data/people';

interface Props {
  selectedPerson?: string;
  onSelected: (name: string | null) => void;
  delay?: number;
}

export const Dropdown: React.FC<Props> = ({
  selectedPerson,
  onSelected,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [activeDropDown, setActiveDropDown] = useState(false);

  const personsNames = useMemo(
    () => peopleFromServer.map(person => person.name),
    [],
  );

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (selectedPerson) {
        onSelected(null);
      }

      setQuery(event.target.value);
      applyQuery(event.target.value);
    },
    [selectedPerson, applyQuery, setQuery, onSelected],
  );

  const filteredPersonsNames = useMemo(() => {
    return personsNames.filter(person =>
      person.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery, personsNames]);

  const handlePersonName = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>, person: string) => {
      if (event.button !== 0) {
        return;
      }

      setQuery(person);
      onSelected(person);
      setAppliedQuery(person);
    },
    [onSelected],
  );

  return (
    <>
      <div
        className={cn('dropdown', {
          'is-active': activeDropDown,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setActiveDropDown(!activeDropDown)}
            onBlur={() => setActiveDropDown(!activeDropDown)}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPersonsNames.length ? (
              filteredPersonsNames.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person}
                  onMouseDown={event => handlePersonName(event, person)}
                >
                  <p className="has-text-link">{person}</p>
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
    </>
  );
};
