import { Person } from '../types/Person';

interface Props {
  people: Person[];
  onSelected: (person: Person) => void;
}

export const Dropdown: React.FC<Props> = ({ people, onSelected }) => {
  return people.length === 0 ? (
    <div
      className="notification is-danger is-light mt-3 is-align-self-flex-start"
      role="alert"
      data-cy="no-suggestions-message"
    >
      <p className="has-text-danger">No matching suggestions</p>
    </div>
  ) : (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {people.map(person => (
          <div
            key={person.slug}
            className="dropdown-item"
            data-cy="suggestion-item"
            onMouseDown={event => {
              event.preventDefault();
              onSelected(person);
            }}
          >
            <p className="has-text-link">{person.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
