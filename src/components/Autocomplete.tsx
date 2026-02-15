import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';
import { useState } from 'react';

interface Props {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  delay,
}) => {
  const [shownPeople, setShownPeople] = useState([...people]);
  const [focused, setFocused] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');

  const shownPeopleUpdater = debounce(setShownPeople, delay);

  const handleSelect = (person: Person) => {
    setCurrentQuery(person.name);
    onSelected(person);
  };

  const handleFilter = (query: string) => {
    const queryLow = query.toLowerCase();

    setCurrentQuery(query);
    onSelected(null);

    shownPeopleUpdater(
      [...people].filter(person =>
        person.name.toLowerCase().includes(queryLow),
      ),
    );
  };

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={currentQuery}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
            }}
            onChange={e => {
              handleFilter(e.target.value);
            }}
          />
        </div>

        {focused && shownPeople[0] && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {shownPeople.map(person => (
                <div
                  className="dropdown-item"
                  key={person.slug}
                  data-cy="suggestion-item"
                >
                  <a
                    onMouseDown={() => {
                      handleSelect(person);
                    }}
                    className={classNames({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                  >
                    {person.name}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {focused && !shownPeople[0] && (
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
