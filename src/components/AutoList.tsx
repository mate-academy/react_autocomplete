import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';

type Props = {
  onSelect: (person: Person | null) => void;
  delay?: number;
};

export const Autolist: React.FC<Props> = ({ onSelect, delay = 300 }) => {
  const [query, setQuery] = useState('');
  const [filtrQuery, setFiltrQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const dropListRef = useRef<HTMLDivElement | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedQuery = useCallback(
    debounce((value: string) => {
      setFiltrQuery(value);
      setIsVisible(true);
    }, delay),
    [delay],
  );

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedQuery(event.target.value);
    setQuery(event.target.value);
    onSelect(null);
    setIsVisible(false);
  };

  const onListClick = (selectedPerson: Person) => {
    setFiltrQuery(selectedPerson.name);
    setQuery(selectedPerson.name);
    onSelect(selectedPerson);
    setIsVisible(false);
  };

  const offListClick = (event: MouseEvent) => {
    if (
      dropListRef.current &&
      !dropListRef.current.contains(event.target as Node)
    ) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('mousedown', offListClick);
    }

    return () => {
      document.removeEventListener('mousedown', offListClick);
    };
  }, [isVisible]);

  const matchedPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(filtrQuery.toLowerCase().trim()),
    );
  }, [filtrQuery]);

  return (
    <>
      <div className="dropdown is-active" ref={dropListRef}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={onInputChange}
            onFocus={() => setIsVisible(true)}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          {isVisible && (
            <div className="dropdown-content">
              {matchedPeople.length ? (
                matchedPeople.map((person: Person) => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.name}
                    onClick={() => onListClick(person)}
                  >
                    <p className="has-text-link">{person.name}</p>
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
    </>
  );
};
