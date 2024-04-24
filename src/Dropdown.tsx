import { useMemo, useState } from 'react';
import classNames from 'classnames';
import { debounce } from './debounce';
import { Person } from './types/Person';

type Props = {
  delay?: number;
  peopleList: Person[];
  onSelected: (person: Person | null) => void;
};

const Dropdown: React.FC<Props> = ({ delay = 300, onSelected, peopleList }) => {
  const [query, setQuery] = useState('');
  const [hasInputShown, setHasInputShown] = useState(false);

  const closeDelay = 200;

  const applyName = useMemo(
    () => debounce(() => setHasInputShown(true), delay),
    [delay],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyName();

    setQuery(event.target.value);
    setHasInputShown(false);
    onSelected(null);
  };

  const filteredPeople = useMemo(() => {
    return peopleList.filter(person => {
      const normalizedName = query.toLowerCase().trim();

      return person.name.toLowerCase().includes(normalizedName);
    });
  }, [query, peopleList]);

  const handleBlurChange = () => {
    setTimeout(() => {
      setHasInputShown(false);
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
          'is-active': hasInputShown,
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
            onFocus={() => setHasInputShown(true)}
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
