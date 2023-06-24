import cn from 'classnames';
import { FC } from 'react';
import { Person } from '../../types/Person';

interface Props {
  persons: Person[];
  onSelectPerson: React.Dispatch<React.SetStateAction<Person | null>>;
  setSelectMenuVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PersonsSelect:FC<Props> = (
  { persons, onSelectPerson, setSelectMenuVisible },
) => (
  <>
    {persons.map(person => {
      const { name, sex, slug } = person;
      const isMale = sex === 'm';

      return (
        <div key={slug} className="dropdown-item">
          <a
            href={`#${slug}`}
            className={cn('dropdown-item', {
              'has-text-link': isMale,
              'has-text-danger': !isMale,
            })}
            onClick={(e) => {
              e.preventDefault();
              setSelectMenuVisible(false);
              onSelectPerson(person);
            }}
          >
            {name}
          </a>
        </div>
      );
    })}
  </>
);
