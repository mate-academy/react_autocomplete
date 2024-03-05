import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
  useRef,
} from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';
import './Dropdown.scss';

type Props = {
  people: Person[];
  selectPerson: Dispatch<SetStateAction<Person | null>>;
  setIsMatched: Dispatch<SetStateAction<boolean>>;
};

export const Dropdown: React.FC<Props> = ({
  people,
  selectPerson,
  setIsMatched,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, 300), []);

  const filteredPeople = people.filter(({ name }) =>
    name.toLowerCase().includes(appliedQuery.toLowerCase()),
  );

  const isMatched = filteredPeople.length > 0;

  const handleSelectPerson = (name: string) => {
    const selectedPerson = people.find(person => person.name === name);

    if (selectedPerson) {
      selectPerson(selectedPerson);
      setIsFocused(false);
    }
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setIsFocused(true);
    setQuery(value);
    applyQuery(value);
    selectPerson(null);
  };

  useEffect(() => {
    setIsMatched(isMatched);
  }, [isMatched, setIsMatched]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="dropdown is-active" ref={dropdownRef}>
      <div className="dropdown-trigger">
        <input
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setIsFocused(true)}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
        />
      </div>

      <div
        className="dropdown-menu dropdown-menu--overflow"
        role="menu"
        data-cy="suggestions-list"
      >
        {isFocused && isMatched && (
          <div className="dropdown-content">
            {filteredPeople.map(({ name, slug }) => (
              <div
                onClick={() => handleSelectPerson(name)}
                onKeyDown={e => e.key === 'Enter' && handleSelectPerson(name)}
                tabIndex={0}
                role="button"
                className="dropdown-item dropdown-item--hover is-clickable"
                data-cy="suggestion-item"
                key={slug}
              >
                <p className="has-text-link">{name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
