import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import cn from 'classnames';
import debounce from 'lodash.debounce';

import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  delay?: number;
  onSelected?: (person: Person | null) => void;
};

const AutocompleteBase: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected = () => {},
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Person | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(setAppliedQuery, delay), [delay]);

  const selectOption = (option: Person | null) => {
    setSelectedOption(option);
    onSelected(option);
  };

  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentQuery = e.target.value;

    setQuery(currentQuery);
    applyQuery(currentQuery);

    if (selectedOption) {
      selectOption(null);
    }
  };

  const visibleOptions = useMemo(() => {
    return people.filter(person => {
      const personName = person.name.trim().toLowerCase();
      const filterQuery = appliedQuery.trim().toLowerCase();

      return personName.includes(filterQuery);
    });
  }, [appliedQuery, people]);

  const handleFocus = () => {
    setIsOptionsOpen(true);
  };

  const handleSelectOption = (person: Person) => {
    selectOption(person);
    setQuery(person.name);
    setIsOptionsOpen(false);
  };

  useEffect(() => {
    const closeOptions = (event: PointerEvent) => {
      if (event.target !== inputRef.current) {
        setIsOptionsOpen(false);
      }
    };

    document.body.addEventListener('click', closeOptions);

    return () => {
      document.body.removeEventListener('click', closeOptions);
    };
  }, [inputRef]);

  return (
    <>
      <div
        className={cn('dropdown', {
          'is-active': visibleOptions.length !== 0 && isOptionsOpen,
        })}
      >
        <div className="dropdown-trigger">
          <input
            ref={inputRef}
            id="search-people-input"
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={onQueryChange}
            onFocus={handleFocus}
          />
        </div>
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {visibleOptions.map(person => (
              <button
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => handleSelectOption(person)}
              >
                <p
                  className={cn('has-text-link', {
                    'has-text-danger': person.sex === 'f',
                  })}
                >
                  {person.name}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
      {visibleOptions.length === 0 && (
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

export const Autocomplete = React.memo(AutocompleteBase);
