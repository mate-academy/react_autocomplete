import type { Person } from '../types/Person';

interface PeopleListProps {
  people: Person[];
  onSelect?: (person: Person) => void;
}

export const PeopleList = ({
  people,
  onSelect = () => {},
}: PeopleListProps) => {
  return (
    <>
      {people.map(person => (
        <div
          key={person.slug}
          className="dropdown-item has-text-link is-clickable"
          data-cy="suggestion-item"
          onClick={() => onSelect(person)}
        >
          {person.name}
        </div>
      ))}
    </>
  );
};
