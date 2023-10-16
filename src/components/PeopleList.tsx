import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { useCallback, useMemo, useState } from 'react';
import { Person } from '../types/Person';

interface Props {
  people: Person[],
  onSelect: (person: Person | null) => void;
}

export const PeopleList: React.FC<Props> = ({
  people,
  onSelect,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isShown, setIsShown] = useState(false);

  const applyQuery = useCallback((value: string) => {
    debounce(() => setAppliedQuery(value), 1000);
  }, [setAppliedQuery]);

  const handlePersonSelect = (person: Person) => {
    onSelect(person);
    setQuery(person.name);
    setAppliedQuery(person.name);
    setIsShown(false);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    onSelect(people.find(({ name }) => name === newQuery) || null);
    setQuery(newQuery);
    applyQuery(newQuery);

    if (!newQuery) {
      setAppliedQuery('');
    }
  };

  const filteredPeople = useMemo(() => {
    if (query) {
      return people.filter(person => person.name.includes(appliedQuery));
    }

    return people;
  }, [people, query, appliedQuery]);

  return (
    <div className={classNames('dropdown',
      {
        'is-active': isShown,
      })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setIsShown(true)}
          onBlur={() => setIsShown(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {!filteredPeople.length
            ? (
              <div
                style={{
                  padding: '15px',
                  backgroundColor: '#e9fafa',
                }}
              >
                No matching suggestion
              </div>
            ) : (
              filteredPeople.map(person => (
                <a
                  href="/"
                  className="dropdown-item"
                  key={person.slug}
                  onMouseDown={() => handlePersonSelect(person)}
                >
                  <p
                    className={classNames(
                      person.sex === 'm'
                        ? 'has-text-link'
                        : 'has-text-danger',
                    )}
                  >
                    {person.name}
                  </p>
                </a>
              ))
            )}
        </div>
      </div>
    </div>
  );
};
