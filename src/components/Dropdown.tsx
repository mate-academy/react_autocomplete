import { useCallback, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

type Props = {
  people: Person[],
  searchDelay: number,
  onSelected: (person: Person) => void,
};

function getFilteredPeople(people: Person[], query: string) {
  if (!query) {
    return people;
  }

  return people.filter(({ name }) => {
    const queryLower = query.trim().toLowerCase();
    const nameLower = name.toLowerCase();

    return nameLower.includes(queryLower);
  });
}

const FEMALE = 'f';
const MALE = 'm';

export const Dropdown: React.FC<Props> = ({
  people,
  searchDelay,
  onSelected,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const personList = getFilteredPeople(people, appliedQuery);

  const handlePersonClick = (person: Person) => {
    setQuery(person.name);
    setAppliedQuery(person.name);
    setIsOpen(false);
    onSelected(person);
  };

  const applyQuery = useCallback(
    debounce(setAppliedQuery, searchDelay),
    [],
  );

  const handelQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={handelQueryChange}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        {isOpen && (
          <div className="dropdown-content">
            {personList.length
              ? (
                personList.map((person) => (
                  <div
                    className="dropdown-item"
                    key={person.slug}
                    role="button"
                    onClick={() => handlePersonClick(person)}
                    onKeyDown={() => { }}
                    tabIndex={0}
                  >
                    <p className={classNames(
                      { 'has-text-link': person.sex === MALE },
                      { 'has-text-danger': person.sex === FEMALE },
                    )}
                    >
                      {person.name}
                    </p>
                  </div>
                ))
              ) : (
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
};
