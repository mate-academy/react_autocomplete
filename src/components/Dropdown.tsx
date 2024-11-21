import React, {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import cn from 'classnames';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';

type Props = {
  onSelected: (person: Person | null) => void;
  people: Person[];
  delay?: number;
};

export const Dropdown: React.FC<Props> = ({
  onSelected = () => {},
  people,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isShown, setIsShown] = useState(false);
  const dropdownRef = useRef<HTMLInputElement | null>(null);

  const applyQuery = useCallback(
    debounce((value: string) => {
      setAppliedQuery(value);
    }, delay),
    [],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    onSelected(null);
  };

  const handleSelection = (selectedPerson: Person) => {
    setQuery(selectedPerson.name);
    setAppliedQuery(selectedPerson.name);
    onSelected(selectedPerson);
    setIsShown(false);
  };

  const handleOutsideClick = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsShown(false);
    }
  };

  const filteredPeople = useMemo(() => {
    return people.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase().trim()),
    );
  }, [appliedQuery]);

  useEffect(() => {
    if (isShown) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isShown]);

  return (
    <div
      className={cn('dropdown', {
        'is-active': isShown,
      })}
      ref={dropdownRef}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleChange}
          onFocus={() => setIsShown(true)}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        {filteredPeople.length ? (
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.slug}
                onClick={() => handleSelection(person)}
              >
                <p
                  className={cn('has-text-link', 'is-clickable', {
                    'has-text-danger': person.sex === 'f',
                  })}
                >
                  {person.name}
                </p>
              </div>
            ))}
          </div>
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
  );
};
