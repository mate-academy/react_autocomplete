import cn from 'classnames';
import { Person } from '../types/Person';

interface Props {
  query: string
  handleQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  filteredPeople: Person[]
  onSelected: (
    event : React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => void
  focus: boolean
}

export const Autocomplate: React.FC<Props> = ({
  query,
  handleQueryChange,
  filteredPeople,
  onSelected,
  focus,
}) => {
  return (
    <div className={cn(
      'dropdown',
      'is-flex-direction-column',
      'is-align-self-flex-start',
      { 'is-hoverable': focus },
    )}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleQueryChange}
          onFocus={handleQueryChange}
        />
      </div>

      {filteredPeople.length === 0
        ? (
          <div
            className="
              notification
              is-danger
              is-light
              mt-2
              is-align-self-flex-start
            "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        ) : (
          <div
            className="dropdown-menu"
            role="menu"
            data-cy="suggestions-list"
          >
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <a
                  key={person.slug}
                  href="."
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={onSelected}
                >
                  <p
                    className={cn({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                  >
                    {person.name}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}

    </div>
  );
};
