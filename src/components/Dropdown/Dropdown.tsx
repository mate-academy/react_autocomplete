import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { Person } from '../../types/Person';

type Props = {
  users: Person[];
  onSelected: (user?: Person) => void;
  delay: number;
  selectedPerson?: Person,
};

export const Dropdown: React.FC<Props> = ({
  users,
  onSelected,
  delay,
  selectedPerson
}) => {
  const [active, setActive] = useState(false);
  const dropDownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!dropDownRef.current?.contains(e.target as Node)) {
        setActive(false);

        if (inputRef.current) {
          inputRef.current.value = '';
          setQuery('');
        }
      }
    };

    document.addEventListener('mousedown', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
    };
  }, [active]);

  const debounce = (callback: Function) => {
    let timerId = 0;

    return (...args: any) => {
      window.clearTimeout(timerId);

      timerId = window.setTimeout(() => {
        callback(...args);
      }, delay);
    };
  };

  const handleUserSelection = (person: Person) => {
    onSelected(person);
    setActive(false);
    setQuery('');

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const appliedQuery = useCallback(debounce(setQuery), [query]);

  const filteredPeople = useMemo(
    () => users.filter(person => person.name.includes(query)),
    [query],
  );

  return (
    <>
      <div className="dropdown is-active" ref={dropDownRef}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            onFocus={() => setActive(!active)}
            onChange={event => {
              appliedQuery(event.target.value);
              onSelected();
            }}
            ref={inputRef}
          />
        </div>

        {active && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            {filteredPeople.length > 0 && (
              <div className="dropdown-content">
                {filteredPeople.map(person => (
                  <div
                    className="dropdown-item"
                    style={person === selectedPerson ? {backgroundColor: 'lightblue'}: {}}
                    data-cy="suggestion-item"
                    key={person.slug}
                  >
                    <p
                      className="has-text-link"
                      key={person.slug}
                      onClick={() => handleUserSelection(person)}
                    >
                      {person.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {filteredPeople.length === 0 && (
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
