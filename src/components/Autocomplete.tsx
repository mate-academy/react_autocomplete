import cn from 'classnames';
import { useState, useMemo, useRef } from 'react';
import { Person } from '../types/Person';

type Props = {
  onSelected: (person: Person) => void;
  people: Person[]
};

export const Autocomplete: React.FC<Props> = ({ onSelected, people }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocusInput, setIsFocusInput] = useState(false);

  const timerId = useRef(0);
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => {
      setAppliedQuery(event.target.value);
    }, 1000);
  };

  const handleSelected = (person: Person) => {
    onSelected(person);
    setQuery(person.name);
  };

  const filteredPeople = useMemo(() => {
    return people.filter(
      person => person.name
        .toLowerCase().includes(appliedQuery.trim().toLowerCase()),
    );
  }, [appliedQuery, people]);

  return (
    <div className={cn('dropdown', {
      'is-active': isFocusInput,
    })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onFocus={() => setIsFocusInput(true)}
          onBlur={() => setIsFocusInput(false)}
          onChange={handleQueryChange}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {!filteredPeople.length ? (
            <div className="dropdown-item">
              <p className="has-text-danger">No select person</p>
            </div>
          ) : (
            filteredPeople.map(person => {
              const { name, sex, slug } = person;

              return (
                <div
                  key={slug}
                  className="dropdown-item"
                  role="button"
                  tabIndex={0}
                  onMouseDown={() => handleSelected(person)}
                >
                  <p className={cn(
                    { 'has-text-link': sex === 'm' },
                    { 'has-text-danger': sex === 'f' },
                  )}
                  >
                    {name}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
