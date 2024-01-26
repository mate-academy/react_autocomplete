/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import classNames from 'classnames';
import { Person } from './types/Person';

interface ListProps {
  filteredList: Person[]
  onSelected: (people: Person | null) => void
}

export const List: React.FC<ListProps> = (
  {
    filteredList,
    onSelected,
  },
) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">

        {filteredList.map(person => (
          <div
            className="dropdown-item"
            onClick={() => {
              onSelected(person);
            }}
            key={person.slug}
          >
            <p
              className={classNames({
                'has-text-link': person.sex === 'm',
                'has-text-danger': person.sex === 'f',
              })}
            >
              {person.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
