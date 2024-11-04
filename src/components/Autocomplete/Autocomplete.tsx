import {
  ChangeEvent,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Person } from '../../types/Person';

import _debounce from 'lodash.debounce';
import { Notification } from '../Notification/Notification';

interface AutocompleteProps {
  people: Person[];
  setSelectedPerson: Dispatch<SetStateAction<Person | null>>;
  selectedPerson: Person | null;
  delay?: number;
}

const Autocomplete: FC<AutocompleteProps> = ({
  people,
  setSelectedPerson,
  selectedPerson,
  delay = 300,
}): ReactNode => {
  const [isActive, setActive] = useState(false);
  const [query, setQuery] = useState('');
  const [debounceQuery, setDebounceQuery] = useState('');

  const debouncedSetQuery = _debounce(setDebounceQuery, delay);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      if (!isActive) {
        setActive(true);
      }

      setQuery(value);
      debouncedSetQuery(value);

      if (selectedPerson) {
        setSelectedPerson(null);
      }
    },
    [isActive, selectedPerson],
  );

  const handleSelectReset = () => {
    if (isActive) {
      setActive(false);
    }
    if (query) {
      setQuery('');
    }
  };

  const handleSelectPerson = useCallback(
    (person: Person) => {
      setSelectedPerson(person);

      if (isActive || query) {
        handleSelectReset();
      }
    },
    [isActive, query],
  );

  const filtredPeople = useMemo(
    () => people.filter(({ name }) => name.includes(debounceQuery)),
    [debounceQuery, people],
  );

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={selectedPerson ? selectedPerson.name : query}
          onFocus={() => setActive(true)}
          onChange={handleChange}
        />
      </div>

      {isActive && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filtredPeople.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.name}
                onClick={() => handleSelectPerson(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}

            {!!filtredPeople.length && <Notification />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
