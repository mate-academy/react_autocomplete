/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
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
  const handleMouseDown = (
    person: Person,
  ) => {
    onSelected(person);
    setQuery(person.name);
  };

  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length ? people.map((person) => {
          const { name, slug } = person;

          return (
            <div
              className="dropdown-item"
              key={slug}
            >
              <a
                className="has-text-link link"
                onMouseDown={() => handleMouseDown(person)}
              >
                {name}
              </a>
            </div>
          );
        }) : (
          <div className="dropdown-item">
            <p className="has-text-danger">No matching suggestions </p>
          </div>
        )}
      </div>
    </div>
  );
};
