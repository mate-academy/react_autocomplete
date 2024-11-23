import classNames from 'classnames';
import { Person } from '../types/Person';
import { useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import './Autocomplete.scss';

type Props = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected = () => {},
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [focusOnInput, setFocusOnInput] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = debounce((value: string) => {
    setAppliedQuery(value.trim());
  }, delay);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value.trim() !== '') {
      setQuery(value);
      applyQuery(value);
    } else {
      setQuery('');
      setAppliedQuery('');
    }

    setFocusOnInput(true);
    onSelected(null);
  };

  const onSelectPerson = (person: Person) => {
    onSelected(person);
    setFocusOnInput(false);
    setQuery(person.name);
  };

  const filteredPeople = useMemo(() => {
    return people.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery, people]);

  return (
    <div
      className={classNames('dropdown', {
        'is-active': focusOnInput,
      })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          data-cy="search-input"
          onFocus={() => setFocusOnInput(true)}
          onBlur={() => setFocusOnInput(false)}
          onChange={onInputChange}
        />
      </div>

      {focusOnInput && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.length > 0 ? (
              filteredPeople.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onMouseDown={() => onSelectPerson(person)}
                >
                  <p
                    className={classNames('has-text-link', {
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
      )}
    </div>
  );
};
