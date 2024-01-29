import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelect: (person: Person | null) => void;
};

export const PeopleList: React.FC<Props> = ({ people, onSelect }) => {
  // const handlePersonClick
  //   = (event: React.MouseEvent<HTMLAnchorElement>, person: Person) => {
  //     event.preventDefault();
  //     onSelect(person);
  //   };
  const handlePersonClick = (person: Person) => {
    onSelect(person);
  };

  return (
    <div className="dropdown-content">
      {people.length === 0 ? (
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
      ) : (
        people.map((person) => (
          <div
            key={person.slug}
            className="dropdown-item"
            data-cy="suggestion-item"
            role="button"
            tabIndex={0}
            onClick={() => handlePersonClick(person)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                handlePersonClick(person);
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <p className="has-text-link">{person.name}</p>
          </div>
        ))
      )}
    </div>
  );
};
