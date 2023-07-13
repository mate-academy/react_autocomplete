import cn from 'classnames';
import React, { useState, useMemo } from 'react';
import { Person } from '../types/Person';
import { useDebounde } from '../hooks/useDebounce';

type Props = {
  people: Person[]
  onSelected: (arg: Person) => void,
  selectedPerson: Person | null,
  delay: number,
};

const linkClass = (person: Person) => cn({
  'has-text-link': person.sex === 'm',
  'has-text-danger': person.sex === 'f',
});

const Dropdown = React.memo(({
  people,
  onSelected,
  selectedPerson,
  delay,
}: Props) => {
  const [searchTerms, setSearchTerms] = useState('');

  const debounced = useDebounde(searchTerms, delay);

  const showModal = debounced && debounced === searchTerms
    && debounced !== selectedPerson?.name;

  const filteredPeople = useMemo(() => {
    return people.filter(({ name }) => name
      .toLowerCase()
      .includes(debounced.toLowerCase()));
  }, [debounced]);

  const handleSearchTermsChange = (terms: string) => {
    setSearchTerms(terms);
  };

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
          onChange={(e) => handleSearchTermsChange(e.target.value)}
        />
      </div>

      {showModal && (
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
