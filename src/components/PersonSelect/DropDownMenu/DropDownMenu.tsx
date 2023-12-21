import classNames from 'classnames';
import { Person } from '../../../types/Person';
import './DropDownMenu.scss';
import { MESSAGES, KEYS, SEX } from '../../../enums';

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
    event: React.KeyboardEvent<HTMLLIElement>,
    person: Person,
  ) => {
    if (event.key === KEYS.enter) {
      onSelect(person);
    }
  };

  return (
    <div className="dropdown-menu" role="menu">
      <ul className="dropdown-content">
        {people.length ? (
          people.map((person) => (
            <li
              key={person.slug}
              className="dropdown-item dropdown-item--hover"
              onClick={() => onClickHandler(person)}
              onKeyDown={(event) => onKeyPressHandler(event, person)}
              role="menuitem"
              tabIndex={0}
            >
              <p
                className={classNames({
                  'has-text-link': person.sex === SEX.male,
                  'has-text-danger': person.sex === SEX.female,
                })}
              >
                {person.name}
              </p>
            </li>
          ))
        ) : (
          <li className="dropdown-item">
            <p>{ MESSAGES.noMatchingSuggestions }</p>
          </li>
        )}
      </ul>
    </div>
  );
};
