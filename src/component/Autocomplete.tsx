import { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelected: (person: Person) => void;
  delay: number;
};

function debounce<T>(callback: (value: T) => void, delay: number) {
  let timerId = 0;

  return (arg: T) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(arg);
    }, delay);
  };
}

export const Autocomplete: React.FC<Props> = ({ people, onSelected }) => {
  const [query, setQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  // eslint-disable-next-line
  const applyQuery = useCallback(debounce((str: string) => {
    setAppliedQuery(str);
    setIsActive(true);
  }, 1000), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsActive(false);
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    return people.filter(person => person.name.toLowerCase()
      .includes(appliedQuery.trim().toLowerCase()));
  }, [people, appliedQuery]);

  return (
    <div className={classNames('dropdown', {
      'is-active': isActive,
    })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
          onChange={handleQueryChange}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPeople.length === 0 ? (
            <div className="dropdown-item">
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          ) : filteredPeople.map(person => (
            <a
              href="/"
              className="dropdown-item"
              key={person.slug}
              onMouseDown={() => {
                setQuery(person.name);
                onSelected(person);
              }}
            >
              <p
                className={classNames('has-text-link', {
                  'has-text-danger': person.sex === 'f',
                })}
              >
                {person.name}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};
