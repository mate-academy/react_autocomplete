import cn from 'classnames';
import { FC } from 'react';
import { Person } from '../types/Person';

interface Props {
  persons: Person[];
}

export const PersonsSelect:FC<Props> = ({ persons }) => (
  <>
    {persons.map(person => {
      const { name, sex, slug } = person;
      const isMale = sex === 'm';

      return (
        <div key={slug} className="dropdown-item">
          <p
            className={cn({
              'has-text-link': isMale,
              'has-text-danger': !isMale,
            })}
          >
            {name}
          </p>
        </div>
      );
    })}
  </>
);
