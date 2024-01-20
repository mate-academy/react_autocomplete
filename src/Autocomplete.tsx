import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';

type Props = {
  people: Person[];
  onSelected?:(person:Person | null) => void;
  delay: number;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected = () => {},
  delay,
}) => {
  const [query, setQuery] = useState('');
  const [dropdownActive, setDropdownActive] = useState(false);
  const [choosePeople, setChoosePeople] = useState('');

  const selectPerson = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => {
    event.preventDefault();

    setChoosePeople(person.name);
    onSelected(person);
    setDropdownActive(false);
  };

  const applyQuery = useMemo(
    () => debounce(setQuery, delay), [delay],
  );

  const dropActive = () => {
    setDropdownActive(true);
  };

  const blurActive = () => {
    setChoosePeople('');
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyQuery(event.target.value);
    setChoosePeople(event.target.value);
    onSelected(null);
  };

  const filteredSuggestions: Person[]
  = useMemo(() => {
    return people.filter(
      (item) => item.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query, people]);

  return (
    <main className="section">

      <div className={classNames('dropdown', {
        ' is-active': dropdownActive,
      })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={choosePeople}
            onFocus={dropActive}
            onBlur={blurActive}
            onChange={handleQueryChange}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">

            {filteredSuggestions.length
              ? filteredSuggestions.map((person) => (
                <a
                  className="dropdown-item"
                  key={person.slug}
                  href="/#"
                  onClick={event => selectPerson(event, person)}
                >
                  <p
                    className="has-text-link"
                  >
                    {person.name}
                  </p>
                </a>
              )) : 'No matching suggestions'}

          </div>
        </div>
      </div>
    </main>
  );
};
