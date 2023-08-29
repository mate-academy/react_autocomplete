import React, {
  useState,
  useMemo,
  useCallback,
} from 'react';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';

type Props = {
  peopleFromServer: Person[];
  onSelected: (person: Person) => void,
};

export const Autocomplete: React.FC<Props> = ({
  peopleFromServer,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

  const isInQuery = (personName: string) => {
    return personName.toLowerCase().includes(appliedQuery.toLowerCase());
  };

  const visiblePeople = useMemo(() => {
    return peopleFromServer.filter(person => (
      isInQuery(person.name)
    ));
  }, [appliedQuery, peopleFromServer]);

  const handleSelect = (person: Person) => {
    onSelected(person);
    setQuery(person.name);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <div className="field">
          <p className="control is-expanded has-icons-right">
            <input
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              value={query}
              onChange={handleQueryChange}
              className="input"
              type="search"
              placeholder="Search..."
            />
            <span
              className="icon is-small is-right"
            >
              <i className="fas fa-search" />
            </span>
          </p>
        </div>
      </div>
      {isFocused && (
        <div className="dropdown-menu" id="dropdown-menu" role="menu">
          <div
            className="dropdown-content"
          >
            {visiblePeople.length > 0 ? (
              visiblePeople.map(person => (
                <a
                  href={person.slug}
                  className="dropdown-item"
                  key={person.slug}
                  onMouseDown={() => handleSelect(person)}
                >
                  {person.name}
                </a>
              ))
            ) : (
              <a
                href="/"
                className="dropdown-item"
              >
                No matching suggestions
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
