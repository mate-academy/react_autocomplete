import { useState, useMemo, ChangeEvent } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';
import { peopleFromServer } from '../../data/people';

type Props = {
  delay: number;
  onSelected: (person: Person | null) => void;
};

export const Autocomplete = ({ delay, onSelected }: Props) => {
  const [showList, setShowList] = useState(false);
  const [inputName, setInputName] = useState('');
  const [people, setPeople] = useState<Person[]>([...peopleFromServer]);
  const [hasMatchedError, setHasMatchedError] = useState(false);

  // Filter suggestions list
  const filterSuggestions = (value: string) => {
    const trimmed = value.trim();

    if (trimmed === '') {
      setPeople([...peopleFromServer]);
      setHasMatchedError(false);

      return;
    }

    const filtered = peopleFromServer.filter(p =>
      p.name.toLowerCase().includes(trimmed.toLowerCase()),
    );

    setPeople(filtered);
    setHasMatchedError(filtered.length === 0);
  };

  // useMemo/useCallback для debounce
  const debouncedFilter = useMemo(
    () => debounce(filterSuggestions, delay),
    [delay],
  );

  // Input onChange function
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setInputName(value);
    debouncedFilter(value);
    setShowList(true);
    setHasMatchedError(false);
    onSelected(null);

    if (value === '') {
      setShowList(false);
      onSelected(null);
    }

    if (people.length === 0) {
      setHasMatchedError(true);
    }
  };

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            value={inputName}
            onChange={onChange}
            onFocus={() => setShowList(true)}
            onBlur={() => setShowList(false)}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
          />
        </div>

        {showList && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {people.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.name}
                  onMouseDown={() => {
                    onSelected(person);
                    setInputName(person.name);
                    setShowList(false);
                  }}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {hasMatchedError && (
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
