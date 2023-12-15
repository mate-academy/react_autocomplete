import { useEffect, useState } from 'react';
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
    onSelect(person);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleChange}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {peopleList.length
            ? peopleList.map(person => (
              <div className="dropdown-item" key={person.slug}>
                <a
                  href="/"
                  className={classNames(`has-text-${person.sex === 'm' ? 'link' : 'danger'}`)}
                  onClick={(event) => handleClick(event, person)}
                >
                  {person.name}
                </a>
              </div>
            ))
            : (
              <div className="dropdown-item">
                <p>
                  No matching suggestions
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
