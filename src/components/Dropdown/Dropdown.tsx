import classNames from 'classnames';
import { Person } from '../../types/Person';
import { Notification } from '../Notification/Notification';

type DropdownProps = {
  visibleDropdown: boolean;
  setVisibleDropdown: (visible: boolean) => void;
  people: Person[];
  onSelected: (ps: Person) => void;
  query: string;
  onChangeQuery: (qr: string) => void;
};

export const Dropdown: React.FC<DropdownProps> = ({
  visibleDropdown,
  setVisibleDropdown,
  query,
  people,
  onSelected,
  onChangeQuery,
}) => {
  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            onFocus={() => {
              setVisibleDropdown(true);
            }}
            value={query}
            onChange={e => onChangeQuery(e.target.value)}
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
          />
        </div>

        {visibleDropdown && people.length !== 0 && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {people.map(person => (
                <div
                  className="dropdown-item"
                  key={person.slug}
                  data-cy="suggestion-item"
                >
                  <p
                    className={classNames({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                    onClick={() => onSelected(person)}
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {people.length === 0 && (
        <Notification textNotification="No matching suggestions" />
      )}
    </>
  );
};
