import { useCallback, useMemo, useState } from 'react';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';
import { peopleFromServer } from '../data/people';
import classNames from 'classnames';

type Props = {
  onSelect: (person: Person) => void;
  onClear: () => void;
};

const Autocomplete: React.FC<Props> = ({ onSelect, onClear }) => {
  const [people] = useState<Person[]>(peopleFromServer);

  const [searchQuery, setSearchQuery] = useState('');
  const [savedQuery, setSavedQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const applyQuery = useCallback(
    debounce((query: string) => {
      setSavedQuery(query);
    }, 300),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    applyQuery(event.target.value);
    onClear();
  };

  const searchedPeople = useMemo(() => {
    const filteredPeople = people.filter(person =>
      person.name.toLowerCase().includes(savedQuery.toLowerCase()),
    );

    return filteredPeople;
  }, [savedQuery, people]);

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowDropdown(false);
    }, 200);
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const hasNoSuggestions = searchedPeople.length === 0;

  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={searchQuery}
          onChange={handleQueryChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </div>
      {showDropdown && (
        <div className="dropdown-content">
          {hasNoSuggestions ? (
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
          ) : (
            <>
              {searchedPeople.map(person => (
                <div
                  key={person.slug}
                  onMouseDown={event => event.preventDefault()}
                  onClick={() => onSelect(person)}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                >
                  <p
                    className={classNames('', {
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
