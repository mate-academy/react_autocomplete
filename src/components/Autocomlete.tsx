import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  people: Person[],
  delay?: number,
  onSelect?: (person: Person) => void,
};

export const Autocomplete: React.FC<Props> = (
  {
    people,
    delay = 1000,
    onSelect = () => {},
  },
) => {
  const refAutocomplete = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const applyQuery = useMemo(
    () => debounce(setAppliedQuery, delay),
    [delay],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleSelectPerson = (
    event: React.MouseEvent<HTMLAnchorElement>,
    person: Person,
  ) => {
    event.preventDefault();

    onSelect(person);
    setQuery(person.name);
    setShowSuggestions(false);
  };

  const filteredPeople = useMemo(() => {
    setIsLoading(false);

    return people.filter(person => person.name.includes(appliedQuery));
  }, [people, appliedQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      setShowSuggestions(!(refAutocomplete.current
        && !refAutocomplete.current.contains(event.target as Node)));
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={refAutocomplete}
      className={classNames('dropdown', { 'is-active': showSuggestions })}
    >
      <div className="dropdown-trigger">
        <div className={classNames('control', { 'is-loading': isLoading })}>
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
          />
        </div>
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPeople.length
            ? filteredPeople.map(person => (
              <a
                href="/#"
                className="dropdown-item"
                key={person.slug}
                onClick={(event) => handleSelectPerson(event, person)}
              >
                <p className="has-text-link">{person.name}</p>
              </a>
            ))
            : (
              <div className="dropdown-item">
                <p>No matching suggestions</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
