import { FC } from 'react';
import cn from 'classnames';
import './DropdownMenu.scss';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  selectedPerson: Person | null;
  onSelect: (person: Person) => void;
};

export const DropdownMenu: FC<Props> = ({
  people,
  selectedPerson,
  onSelect,
}) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {people.map(person => {
          const { name, sex } = person;

          return (
            <div
              key={person.slug}
              className={cn('dropdown-item', {
                'has-background-grey-lighter': selectedPerson === person,
              })}
              data-cy="suggestion-item"
              onClick={() => onSelect(person)}
            >
              <p
                className={cn({
                  'has-text-link': sex === 'm',
                  'has-text-danger': sex === 'f',
                })}
              >
                {name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
