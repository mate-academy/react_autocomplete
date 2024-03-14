import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';
import { peopleFromServer } from '../../data/people';

type Props = {
  onSelect?: (person: Person | null) => void;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = React.memo(
  ({ onSelect = () => {}, delay = 300 }) => {
    const [query, setQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(true);
    const titleField = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (titleField.current) {
        titleField.current.focus();
      }

      if (!query) {
        setShowSuggestions(false);
      }
    }, []);

    const applyQuery = useCallback(() => {
      setShowSuggestions(true);
    }, []);

    const debouncedApplyQuery = debounce(applyQuery, delay);

    const filteredPeople = useMemo(() => {
      return peopleFromServer.filter((person: Person) =>
        person.name.toLowerCase().includes(query.toLowerCase().trim()),
      );
    }, [query]);

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value;

      debouncedApplyQuery();
      onSelect(null);
      setQuery(text);
      setShowSuggestions(false);
    };

    const handlePersonChosen = (person: Person) => {
      setQuery(person.name);
      onSelect(person);
      setShowSuggestions(false);
    };

    const handleInputFocus = () => {
      if (!query) {
        setShowSuggestions(true);
      }
    };

    const handleInputBlur = () => {
      setTimeout(() => {
        setShowSuggestions(false);
      }, delay);
    };

    return (
      <div className={classNames('dropdown', { 'is-active': showSuggestions })}>
        <div className="dropdown-trigger">
          <input
            ref={titleField}
            value={query}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onChange={handleQueryChange}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          {showSuggestions && (
            <div className="dropdown-content">
              {filteredPeople.length ? (
                filteredPeople.map((person: Person) => (
                  <div className="dropdown-item" data-cy="suggestion-item">
                    <p
                      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                      role="button"
                      key={person.name}
                      className={classNames({
                        'has-text-link': person.sex === 'm',
                        'has-text-danger': person.sex === 'f',
                      })}
                      onClick={() => handlePersonChosen(person)}
                      onKeyDown={() => handlePersonChosen(person)}
                      tabIndex={0}
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
          )}
        </div>
      </div>
    );
  },
);
