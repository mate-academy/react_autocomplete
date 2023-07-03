import cn from 'classnames';
import React, { useState, useMemo } from 'react';
import { Person } from '../types/Person';
import { useDebounde } from '../hooks/useDebounce';

type Props = {
  people: Person[]
  onSelected: (arg: Person) => void,
  selectedPerson: Person | null,
};

const linkClass = (person: Person) => cn({
  'has-text-link': person.sex === 'm',
  'has-text-danger': person.sex === 'f',
});

const Dropdown = React.memo(({ people, onSelected, selectedPerson }: Props) => {
  const [searchTerms, setSearchTerms] = useState('');
  const debounced = useDebounde(searchTerms);

  const filteredPeople = useMemo(() => {
    return people.filter(({ name }) => name
      .toLowerCase()
      .includes(debounced.toLowerCase()));
  }, [debounced]);

  const handleSelectPerson = (
    e: React.MouseEvent<HTMLAnchorElement>,
    person: Person,
  ) => {
    e.preventDefault();
    onSelected(person);
    setSearchTerms(person.name);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={searchTerms}
          onChange={(e) => setSearchTerms(e.target.value)}
        />
      </div>

      {debounced && debounced !== selectedPerson?.name && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.length > 0
              ? filteredPeople
                .map(person => (
                  <a
                    href="/"
                    key={person.slug}
                    className="dropdown-item"
                    onClick={(e) => handleSelectPerson(e, person)}
                  >
                    <p className={linkClass(person)}>{person.name}</p>
                  </a>
                ))
              : <p className="dropdown-item">No matching suggestions</p>}
          </div>
        </div>
      )}
    </div>
  );
});

export default Dropdown;
