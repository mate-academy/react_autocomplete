import { Person } from '../../types/Person';
import { useCallback, useState, useMemo } from 'react';
import { peopleFromServer } from '../../data/people';

type Props = {
  onSelected: (person: Person | null) => void;
  selectedPerson: Person | null;
  delay: number;
};

export const Dropdown: React.FC<Props> = ({
  onSelected,
  selectedPerson,
  delay,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filterPeople = useMemo(() => {
    if (!appliedQuery) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase().trim()),
    );
  }, [appliedQuery]);

  const debounce = (callback: (args: string) => void) => {
    let timerId = 0;

    return (args: string) => {
      window.clearTimeout(timerId);

      timerId = window.setTimeout(() => {
        callback(args);
      }, delay);
    };
  };

  const applyDebounceQuery = useCallback(
    debounce((value: string) => {
      setAppliedQuery(value);
      setIsOpen(true);
    }),
    [debounce],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyDebounceQuery(event.target.value);
    setQuery(event.target.value);
    onSelected(null);
    setIsOpen(false);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          value={selectedPerson ? selectedPerson.name : query}
          onChange={handleQueryChange}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
        />
        {!filterPeople.length && (
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

      {filterPeople.length > 0 && isOpen && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filterPeople.map(person => (
              <div
                className="dropdown-item"
                key={person.name}
                data-cy="suggestion-item"
                role="button"
                tabIndex={0}
                onMouseDown={() => onSelected(person)}
                onKeyDown={event => {
                  if (event.key === 'Enter') {
                    onSelected(person);
                  }
                }}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
