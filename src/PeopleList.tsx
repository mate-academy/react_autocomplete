import { Person } from './types/Person';

type Props = {
  people: Person[];
  onSelected: (personSlug: Person) => void;
  setQuery: (value: string) => void;
};

export const PeopleList: React.FC<Props> = ({
  people,
  onSelected,
  setQuery,
}) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length ? people.map((person) => (
          <div
            className="dropdown-item"
            key={person.slug}
          >
            <a
              href={person.slug}
              className="has-text-link link"
              onMouseDown={() => {
                onSelected(person);
                setQuery(person.name);
              }}
            >
              {person.name}
            </a>
          </div>
        )) : (
          <div className="dropdown-item">
            <p className="has-text-danger">No matching suggestions </p>
          </div>
        )}
      </div>
    </div>
  );
};
