import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';
import './autocomplete.scss';

type Props = {
  people: Person[];
  setPerson?: (person: Person) => void;
  delay: number;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  setPerson = () => { },
  delay,
}) => {
  const [dropdownActive, setDropdownActive] = useState(false);
  const [query, setQuery] = useState('');
  const [choosePeople, setChoosePeople] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const applyFilter = useMemo(
    () => debounce((filter: string) => {
      setQuery(filter);
    }, delay),
    [delay],
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

  const handleTimeout = () => {
    if (choosePeople === query) {
      applyFilter(choosePeople);
    }
  };

  const handleInputChange
    = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
      setChoosePeople(value);
      setIsLoading(true);

      applyFilter(value);

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const id = setTimeout(() => {
        setIsLoading(false);
        handleTimeout();
      }, delay);

      setTimeoutId(id);
    };

  const filteredPeople = useMemo(() => {
    return people.filter((person) => person.name
      .toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  }, [query, people]);

  let content;

  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (filteredPeople.length) {
    content = filteredPeople.map((person) => (
      <a
        className="dropdown-item"
        key={person.slug}
        href="/#"
        onClick={(event) => selectPerson(event, person)}
      >
        <p className="has-text-link">
          <span className="username">{person.name}</span>
        </p>
      </a>
    ));
  } else {
    content = 'No matching suggestions';
  }

  return (
    <div
      className={classNames('dropdown', {
        'is-active': dropdownActive,
      })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          value={choosePeople}
          aria-haspopup="true"
          placeholder="Please enter your text"
          className="input"
          onChange={handleInputChange}
          onFocus={isDropdownActive}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          <div className="user-list">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};
