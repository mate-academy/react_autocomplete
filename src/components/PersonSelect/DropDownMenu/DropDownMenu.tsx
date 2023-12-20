import classNames from 'classnames';
import { Person } from '../../../types/Person';
import './DropDownMenu.scss';

type Props = {
  people: Person[];
  onSelect?: (person: Person) => void;
};

export const DropDownMenu: React.FC<Props> = ({
  people,
  onSelect = () => {},
}) => {
  const onClickHandler = (person: Person) => {
    onSelect(person);
  };

  const onKeyPressHandler = (
    event: React.KeyboardEvent<HTMLDivElement>,
    person: Person,
  ) => {
    if (event.key === 'Enter') {
      onSelect(person);
    }
  };

  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {people.length ? (
          people.map((person) => (
            <div
              key={person.slug}
              className="dropdown-item dropdown-item--hover"
              onClick={() => onClickHandler(person)}
              onKeyDown={(event) => onKeyPressHandler(event, person)}
              role="menuitem"
              tabIndex={0}
            >
              <p
                className={classNames({
                  'has-text-link': person.sex === 'm',
                  'has-text-danger': person.sex === 'f',
                })}
              >
                {person.name}
              </p>
            </div>
          ))
        ) : (
          <div className="dropdown-item">
            <p>No matching suggestions</p>
          </div>
        )}
      </div>
    </div>
  );
};
