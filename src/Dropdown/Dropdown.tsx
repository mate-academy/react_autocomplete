import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  people: Person[];
  delay: number;
  onSelected: (person: Person | null) => void;
};

export const Dropdown: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const input = useRef<HTMLInputElement>(null);

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const normalizedQuery = appliedQuery.trim().toLowerCase();

  const filteredPeople = useMemo(() => {
    return people.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery, people]);

  useEffect(() => {
    input.current?.focus();
  }, []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    onSelected(null);
  };

  const handleSelectPerson = (person: Person) => {
    onSelected(person);
    setIsOpen(false);
  };

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={event => handleQueryChange(event)}
            onClick={() => setIsOpen(true)}
            ref={input}
          />
        </div>

        {isOpen && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            {filteredPeople.map(person => (
              <div className="dropdown-content" key={uuidv4()}>
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handleSelectPerson(person)}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              </div>
            ))}
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
