import { useMemo, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';
import '../Autocomplete/Autocomplete.scss';

interface Props {
  people: Person[];
  setPerson?:(person:Person) => void;
  delay: number;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  setPerson = () => {},
  delay,
}) => {
  const [dropdownActive, setDropdownActive] = useState(false);
  const [query, setQuery] = useState('');
  const [choosePeople, setChoosePeople] = useState('');

  const applyQuery = useMemo(
    () => debounce(setQuery, delay), [delay],
  );
  const selectPerson = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => {
    event.preventDefault();

    setChoosePeople(person.name);
    setPerson(person);
    setDropdownActive(false);
  };

  const isDropdownActive = () => {
    setDropdownActive(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChoosePeople(e.target.value);
    applyQuery(e.target.value);
  };

  const peopleFilter = useMemo(() => {
    return people
      .filter(person => person.name.toLocaleLowerCase()
        .includes(query.toLocaleLowerCase()));
  }, [query, people]);

  return (
    <div className={classNames('dropdown', {
      ' is-active': dropdownActive,
    })}
    >
      <div className="dropdown-trigger ">
        <input
          type="text"
          value={choosePeople}
          aria-haspopup="true"
          placeholder="Enter a part of the name"
          className="input"
          onChange={handleInputChange}
          onFocus={isDropdownActive}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div
          className="dropdown-content"
        >
          { peopleFilter.length
            ? peopleFilter.map(person => (
              <a
                className="dropdown-item"
                key={person.name}
                href="/#"
                onClick={event => selectPerson(event, person)}
              >
                <p
                  className="has-text-link"
                >
                  {person.name}
                </p>
              </a>
            ))
            : 'No matching suggestions'}
        </div>
      </div>
    </div>
  );
};
