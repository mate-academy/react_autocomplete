import {
  FC,
  MouseEvent,
  memo,
  useEffect,
} from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  setSelectedPerson: (person: Person) => void;
  setShowSuggestions: (value: boolean) => void;
  visiblePersons: Person[];
};

export const DropdownMenu: FC<Props> = memo(({
  setSelectedPerson,
  setShowSuggestions,
  visiblePersons,
}) => {
  useEffect(() => {
    setShowSuggestions(true);
  }, [visiblePersons]);

  const handleClick = (
    event: MouseEvent<HTMLAnchorElement>,
    person: Person,
  ) => {
    event.preventDefault();
    setSelectedPerson(person);
    setShowSuggestions(false);
  };

  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">

        {visiblePersons.length === 0 && (
          <p>No matching suggestions</p>
        )}
        {visiblePersons.map((person) => (
          <a
            key={person.slug}
            href={`#${person.name}`}
            className="dropdown-item"
            onClick={(event: MouseEvent<HTMLAnchorElement>) => (
              handleClick(event, person)
            )}
          >
            <p className={classNames({
              'male-color': person.sex === 'm',
              'female-color': person.sex === 'f',
            })}
            >
              {person.name}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
});
