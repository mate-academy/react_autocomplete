import React, {
  ChangeEvent,
  useState,
  MouseEvent,
  useMemo,
} from 'react';
import lodash from 'lodash';
import cn from 'classnames';
import { Person } from '../types/Person';
import { peopleFromServer } from '../data/people';

type DropdownProps = {
  onPersonSelected: (person: Person) => void,
};

const DropdownInput: React.FC<DropdownProps> = (
  {
    onPersonSelected,
  },
) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestedPeople, setSuggestedPeople] = useState<Person[]>([]);

  const suggestPeople = useMemo(
    () => lodash.debounce((query) => {
      setSuggestedPeople(peopleFromServer.filter(
        person => person.name.includes(query),
      ));
    }, 1000),
    [],
  );
  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setInputValue(value);
    suggestPeople(value);
  };

  const handleSelectPerson = (
    event: MouseEvent<HTMLAnchorElement>,
    person: Person,
  ) => {
    event.preventDefault();
    onPersonSelected(person);
    setInputValue('');
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={inputValue}
          onChange={handleInput}
        />
      </div>

      {
        (inputValue) && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {
                suggestedPeople.length === 0
                  ? (
                    <p className="dropdown-item">No matching suggestions</p>
                  )
                  : suggestedPeople.map(person => (
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <a
                      className="dropdown-item"
                      href="#"
                      key={person.slug}
                      onClick={(event) => handleSelectPerson(event, person)}
                    >
                      <p className={cn({
                        'has-text-link': person.sex === 'm',
                        'has-text-danger': person.sex === 'f',
                      })}
                      >
                        {person.name}
                      </p>
                    </a>
                  ))
              }
            </div>
          </div>
        )
      }
    </div>
  );
};

export default DropdownInput;
