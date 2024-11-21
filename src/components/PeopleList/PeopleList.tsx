import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  onSelected: (person: Person) => void;
};

export const PeopleList: React.FC<Props> = ({ people, onSelected }) => {
  return people.map(person => (
    <div
      onClick={() => onSelected(person)}
      className="dropdown-item"
      key={person.slug}
      data-cy="suggestion-item"
    >
      <p className={person.sex === 'm' ? 'has-text-link' : 'has-text-danger'}>
        {person.name}
      </p>
    </div>
  ));
};
