import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  people: Person[]
  onSelect: (person: Person) => void;
  delay: number;
};

export const Dropdown = ({ people, onSelect, delay }: Props) => {
  const [query, setQuery] = useState('');
  const [peopleList, setPeopleList] = useState(people);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const filteredPeople = people.filter(person => {
        return person.name.toLowerCase().includes(query.toLowerCase());
      });

      setPeopleList(filteredPeople);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [people, query, delay]);

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    person: Person,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    setQuery(person.name);
    setIsFocused(false);
    onSelect(person);

    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleOnFocus = () => {
    // setQuery('');
    // setPeopleList(people);
    setIsFocused(true);
  };

  return (
    <div className={classNames('dropdown', { 'is-active': isFocused })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          ref={inputRef}
          value={query}
          onChange={handleChange}
          onFocus={handleOnFocus}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <ul className="dropdown-content">
          {peopleList.length
            ? peopleList.map(person => (
              <li className="dropdown-item" key={person.slug}>
                <a
                  href="/"
                  className={classNames(`has-text-${person.sex === 'm' ? 'link' : 'danger'}`)}
                  onMouseDown={(event) => handleClick(event, person)}
                >
                  {person.name}
                </a>
              </li>
            ))
            : (
              <div className="dropdown-item">
                <p>
                  No matching suggestions
                </p>
              </div>
            )}
        </ul>
      </div>
    </div>
  );
};
