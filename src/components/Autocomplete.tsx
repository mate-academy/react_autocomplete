import { Person } from '../types/Person';
import classNames from 'classnames';

export const Autocomplete = ({
  isFocused,
  filteredSuggestions,
  onSelected,
}: {
  isFocused: boolean;
  filteredSuggestions: Person[];
  onSelected: (person: Person) => void;
}) => {
  return (
    <>
      {isFocused && filteredSuggestions.length > 0 && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredSuggestions.map(person => {
              return (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onClick={() => onSelected(person)}
                >
                  <p
                    className={classNames(
                      person.sex === 'm' ? 'has-text-link' : 'has-text-danger',
                    )}
                  >
                    {person.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
