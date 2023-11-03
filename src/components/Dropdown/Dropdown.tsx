import React, {
  useMemo,
  useState,
  ChangeEvent,
  FC,
} from 'react';
import { peopleFromServer } from '../../data/people';
import { Person } from '../../types/Person';

type Props = {
  setSelectedPerson: (person: Person) => void;
  delayTime: number,
};

export const Dropdown: FC<Props> = ({ setSelectedPerson, delayTime }) => {
  const [inputFocus, setInputFocus] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    delay: number,
  ) => {
    setQuery(event.target.value);

    setTimeout(() => {
      setAppliedQuery(event.target.value);
    }, delay);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => {
      const normQuery = appliedQuery.toLowerCase().trim();
      const name = person.name.toLowerCase();

      return name.includes(normQuery);
    });
  }, [appliedQuery]);

  const setAllData = (person: Person) => {
    setSelectedPerson(person);
    setAppliedQuery(person.name);
    setQuery(person.name);
  };

  const onSelected = (
    event: React.MouseEvent<HTMLParagraphElement>, person: Person,
  ) => {
    event.preventDefault();

    setAllData(person);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={(e) => handleInputChange(e, delayTime)}
          onFocus={() => setInputFocus(true)}
          onBlur={() => setInputFocus(false)}
        />
      </div>

      {inputFocus
        && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {filteredPeople.length === 0
                ? (
                  <div className="dropdown-item">
                    <p>No selected person</p>
                  </div>
                )
                : (filteredPeople.map(person => (
                  <div className="dropdown-item" key={person.slug}>
                    {/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */}
                    <p
                      className={person.sex === 'f'
                        ? 'has-text-danger'
                        : 'has-text-link'}
                      onMouseDown={(event) => onSelected(event, person)}
                    >
                      {person.name}
                    </p>
                  </div>
                ))
                )}
            </div>
          </div>
        )}
    </div>
  );
};
