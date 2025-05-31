import { Person } from '../types/Person';

interface Props {
  people: Person[];
  setInputValue: (s: string) => void;
  setIsFocused: (b: boolean) => void;
  setTitle: (s: string) => void;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  setInputValue,
  setIsFocused,
  setTitle,
}) => {
  if (people.length === 0) {
    return (
      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div
          className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {people.map(person => (
          <div
            className="dropdown-item"
            data-cy="suggestion-item"
            key={person.slug}
            onClick={() => {
              setInputValue(person.name);
              setIsFocused(false);
              setTitle(`${person.name} (${person.born} - ${person.died})`);
            }}
          >
            <p className="has-text-link has-text-danger">{person.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
