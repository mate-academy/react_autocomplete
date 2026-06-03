export interface Person {
  name: string;
  sex: 'm' | 'f';
  born: number;
  died: number;
  fatherName: string | null;
  motherName: string | null;
  slug: string;
}

interface PersonsProps {
  persons: Person[];
  onSelect: (person: Person) => void;
}

export const Persons: React.FC<PersonsProps> = ({ persons, onSelect }) => {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {persons.map(person => (
          <a
            href={`#${person.slug}`}
            className="dropdown-item"
            data-cy="suggestion-item"
            key={person.slug}
            onMouseDown={e => {
              e.preventDefault();
              onSelect(person);
            }}
          >
            {person.name}
          </a>
        ))}
      </div>
    </div>
  );
};
