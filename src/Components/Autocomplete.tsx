import React, {
  useState, useMemo, useCallback, useRef,
} from 'react';
import { debounce } from 'lodash';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelected: (person: Person) => void;
};

export const Autocomplete: React.FC<Props> = React.memo(({
  people, onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [focus, setFocus] = useState(false);

  const searchInput = useRef<HTMLInputElement>(null);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const filteredPeople = useMemo(() => {
    return people.filter(person => person.name
      .toLocaleLowerCase().includes(appliedQuery.toLowerCase()));
  }, [appliedQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleSelectedPerson = (
    event: React.MouseEvent<HTMLAnchorElement>,
    person: Person,
  ) => {
    event.preventDefault();
    setQuery(person.name);
    setFocus(false);

    if (searchInput.current) {
      searchInput.current.blur();
    }

    onSelected(person);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          ref={searchInput}
          onChange={handleQueryChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        {focus
          && (
            <div className="dropdown-content">
              {filteredPeople.length
                ? filteredPeople.map(person => (
                  <div key={person.slug} className="dropdown-item">
                    <a
                      href="http"
                      className="has-text-link"
                      onMouseDown={
                        (event) => handleSelectedPerson(event, person)
                      }
                    >
                      {person.name}
                    </a>
                  </div>
                ))
                : (
                  <div className="dropdown-item">
                    <p className="has-text-link">
                      No matching suggestions
                    </p>
                  </div>
                )}
            </div>
          )}
      </div>
    </div>
  );
});
