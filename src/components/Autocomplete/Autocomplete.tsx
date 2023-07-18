import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  delay: number;
  onSelected: (person: Person) => void;
};

const Autocomplete: React.FC<Props> = ({
  people,
  delay,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [isDropdownActive, setDropdownActive] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const normalizedQuery = query.trim().toLowerCase();
      const filtered = people
        .filter(person => person.name.toLowerCase().includes(normalizedQuery));

      setFilteredPeople(filtered);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [query, people, delay]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    setQuery(newQuery);

    if (newQuery.length > 0) {
      setDropdownActive(true);
    } else {
      setDropdownActive(false);
    }
  };

  const handleSelectPerson = (person: Person) => {
    onSelected(person);
    setQuery(person.name);
    setDropdownActive(false);
  };

  return (
    <div className={classNames('dropdown', { 'is-active': isDropdownActive })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleInputChange}
        />
      </div>
      {isDropdownActive && (
        <div className="dropdown-menu">
          <div className="dropdown-content">
            {filteredPeople.length === 0 ? (
              <div className="dropdown-item">No matching suggestions</div>
            ) : (
              filteredPeople.map(person => (
                /* eslint-disable-next-line */
                <div
                  key={person.slug}
                  className={classNames('dropdown-item', 'person', {
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                  onClick={() => handleSelectPerson(person)}
                >
                  {person.name}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Autocomplete;
