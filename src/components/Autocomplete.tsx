import { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import cn from 'classnames';
import { Person } from '../types/Person';

interface Props {
  people: Person[]
  delay: number
  onSelected: (person: Person | null) => void
}

export const Autocomplete: React.FC<Props> = ({
  people,
  delay,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isListShown, setIsListShown] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const filteredPeople = useMemo(() => {
    const normalizedValue = appliedQuery.trim().toLowerCase();

    return people
      .filter(person => person.name.toLowerCase().includes(normalizedValue));
  }, [appliedQuery, people]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!appliedQuery.length) {
      onSelected(null);
    }

    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleInputSelect = (person: Person) => {
    setQuery(person.name);
    onSelected(person);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          className="input"
          placeholder="Enter a part of the name"
          type="text"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setIsListShown(true)}
          onBlur={() => setIsListShown(false)}
        />
      </div>

      {isListShown && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {!filteredPeople.length
              ? (
                <div className="dropdown-item">
                  <p>
                    No matching suggestions
                  </p>
                </div>
              )
              : filteredPeople.map(person => {
                return (
                  <div className="dropdown-item" key={person.slug}>
                    <a
                      href="/"
                      onMouseDown={() => handleInputSelect(person)}
                      className={cn(
                        { 'has-text-link': person.sex === 'm' },
                        { 'has-text-danger': person.sex === 'f' },
                      )}
                    >
                      {person.name}
                    </a>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
