import { Person } from '../types/Person';

type PersonListProps = {
  trimmedQuery: string;
  people: Person[];
  onPersonSelected: (person: Person) => void;
};

export const PersonList: React.FC<PersonListProps> = ({
  trimmedQuery,
  people,
  onPersonSelected,
}) => {
  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(trimmedQuery.toLowerCase()),
  );

  return (
    <>
      {filteredPeople.length ? (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(person => {
              return (
                <>
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={Math.floor(Math.random() * 100)}
                  >
                    <p
                      className="has-text-link"
                      onClick={() => {
                        onPersonSelected(person);
                      }}
                    >
                      {person.name}
                    </p>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      ) : (
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
      )}
    </>
  );
};
