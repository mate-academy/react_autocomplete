import { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import cn from 'classnames';
import { Person } from '../types/Person';

interface Props {
  people: Person[]
  delay: number
  onSelected: (person: Person | null) => void
}

enum Gender {
  Male = 'm',
  Female = 'f',
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
    debounce((value: string) => {
      setAppliedQuery(value);
      setIsListShown(true);
    }, delay),
    [],
  );

  const filteredPeople = useMemo(() => {
    const normalizedValue = appliedQuery.trim().toLowerCase();

    return people
      .filter(person => person.name.toLowerCase().includes(normalizedValue));
  }, [appliedQuery, people]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.trim().toLowerCase();

    if (!inputValue) {
      onSelected(null);
    }

    setIsListShown(false);
    applyQuery(inputValue);

    setQuery(event.target.value);
  };

  const handleInputSelect = (selectedPerson: Person) => {
    setQuery(selectedPerson.name);
    onSelected(selectedPerson);
    setIsListShown(false);
  };

  return (
    <div className={cn(
      'dropdown',
      { 'is-active': isListShown },
    )}
    >
      <div className="dropdown-trigger">
        <input
          className="input"
          type="text"
          placeholder="Enter a part of the name"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setIsListShown(true)}
          onBlur={() => setIsListShown(false)}
        />
      </div>

      {isListShown && !!people.length && (
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
                  <div
                    className="dropdown-item"
                    key={person.slug}
                  >
                    <a
                      href="/"
                      onMouseDown={(event) => {
                        event.preventDefault();
                        handleInputSelect(person);
                      }}
                      className={cn(
                        { 'has-text-link': person.sex === Gender.Male },
                        { 'has-text-danger': person.sex === Gender.Female },
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
