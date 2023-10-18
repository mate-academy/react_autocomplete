import cn from 'classnames';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  selectedPerson: Person | null;
  isDropdownActive: boolean;
  query: string;
  onQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPersonClick: (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person) => void;
  onFocus: () => void;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  selectedPerson,
  isDropdownActive,
  query,
  onQueryChange,
  onPersonClick,
  onFocus,
}) => {
  return (
    <>
      <h1 className="title">
        {selectedPerson === null
          ? 'No person selected'
          : `${selectedPerson?.name} (${selectedPerson?.born} = ${selectedPerson?.died})`}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={onQueryChange}
            onFocus={onFocus}
          />
        </div>

        {isDropdownActive && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {people.map(person => {
                const { name, sex } = person;

                return (
                  <div className="dropdown-item" key={name}>
                    <a
                      href="/"
                      className="dropdown-item"
                      onClick={(event) => onPersonClick(event, person)}
                    >
                      <p className={cn({
                        'has-text-link': sex === 'm',
                        'has-text-danger': sex === 'f',
                      })}
                      >
                        {person.name}
                      </p>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
