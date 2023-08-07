import cn from 'classnames';
import { Person } from '../types/Person';

interface Props {
  people: Person[];
  onSelected: (person: Person) => void;
}
export const DropdownItem: React.FC<Props> = ({ people, onSelected }) => {
  return (
    <div className="dropdown-item">
      {people.length
        ? (people.map(person => (
          <a
            key={person.slug}
            href="/"
            onClick={(event) => {
              event.preventDefault();
              onSelected(person);
            }}
            className={cn('mx-2', { 'has-text-link': person.sex === 'm' },
              { 'has-text-danger': person.sex === 'f' })}
          >
            <p>{person.name}</p>
          </a>
        )))
        : (<p>No matching suggestions</p>)}
    </div>
  );
};
