import { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import { debounce } from './debounce';
import { Person } from './types/Person';

type Props = {
  delay: number;
  peopleList: Person[];
  onSelected: (person: Person | null) => void;
};

const Dropdown: React.FC<Props> = ({ delay, onSelected, peopleList }) => {
  const [query, setQuery] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const closeDelay = 200;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyName = useCallback(debounce(setAppliedQuery, delay), []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyName(event.target.value);
    onSelected(null);
  };

  const filteredPeople = useMemo(() => {
    return peopleList.filter(person => {
      const normalizedName = appliedQuery.toLowerCase().trim();

      return person.name.toLowerCase().includes(normalizedName);
    });
  }, [appliedQuery, peopleList]);

  const handleBlurChange = () => {
    setTimeout(() => {
      setIsInputFocused(false);
    }, closeDelay);
  };

  const handleSelectPerson = (person: Person) => {
    onSelected(person);
    setQuery(person.name);
  };

  return (
    <>
      <div
        className={classNames('dropdown', {
          'is-active': isInputFocused,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsInputFocused(true)}
            onBlur={handleBlurChange}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          {filteredPeople.length > 0 && (
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <button
                  className="dropdown-item button is-white"
                  data-cy="suggestion-item"
                  key={person.slug}
                  type="button"
                  onClick={() => handleSelectPerson(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {!filteredPeople.length && (
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

export default Dropdown;
