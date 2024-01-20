import { Person } from '../../types/Person';

interface Props {
  person: Person;
}

export const PersonItem: React.FC<Props> = ({ person }) => {
  return (
    <div className="dropdown-item">
      <a
        href={person.slug}
        className={person.sex === 'm'
          ? 'has-text-link'
          : 'has-text-danger'}
      >
        {person.name}
      </a>
    </div>
  );
};
