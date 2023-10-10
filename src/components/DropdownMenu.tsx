import { useMemo } from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';
import { peopleFromServer } from '../data/people';

type Props = {
  onSelect: (person: Person) => void;
  appliedQuery: string;
};

function getFilteredPeople(people: Person[], query: string): Person[] {
  const filteredPeople = [...people].filter(person => {
    const name = person.name.toLowerCase();
    const inputName = query.toLowerCase().trim();

    return name.includes(inputName);
  });

  return filteredPeople;
}

export const DropdownMenu: React.FC<Props> = ({
  onSelect,
  appliedQuery,
}) => {
  const filteredPeople: Person[] = useMemo(() => {
    return getFilteredPeople(peopleFromServer, appliedQuery);
  }, [appliedQuery]);

  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {filteredPeople.length !== 0
          ? (filteredPeople.map((person) => (
            <div
              className="dropdown-item"
              key={person.slug}
            >
              <a
                href="#/"
                className={classNames({
                  'has-text-link': person.sex === 'm',
                  'has-text-danger': person.sex === 'f',
                })}
                onClick={(event) => {
                  event.preventDefault();
                  onSelect(person);
                }}
              >
                {person.name}
              </a>
            </div>
          ))) : (
            'No matching suggestions'
          )}
      </div>
    </div>
  );
};
