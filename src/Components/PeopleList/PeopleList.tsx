import React, { useCallback, useMemo, useState } from 'react';
import cn from 'classnames';
import '../../App.scss';
import { peopleFromServer } from '../../data/people';
import { Person } from '../../types/Person';
// import { debounce } from 'cypress/types/lodash';

function debounce(
  callback: React.Dispatch<React.SetStateAction<string>>,
  delay: number,
) {
  let timerId = 0;

  return (args: string) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(args);
    }, delay);
  };
}

export const PeopleList: React.FC<{
  setSelectedPerson: React.Dispatch<React.SetStateAction<Person>>
  setInputValue: React.Dispatch<React.SetStateAction<string>>
  setIsSelected: React.Dispatch<React.SetStateAction<boolean>>
}> = ({
  setSelectedPerson,
  setInputValue,
  setIsSelected,
}) => {
  const [query, setQuery] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(
    debounce(setQuery, 300), [],
  );

  const handleQueryChange = (personName: string) => {
    applyQuery(personName);
    setInputValue(personName);
  };

  const machedPeople = useMemo(() => {
    return peopleFromServer.filter((person) => {
      return person.name.includes(query);
    });
  }, [query]);

  return (
    <div
      className="dropdown-menu"
      role="menu"
      data-cy="suggestions-list"
    >
      {machedPeople.map((person) => {
        return (
          <div className="dropdown-content">
            <div
              className="dropdown-item"
              data-cy="suggestion-item"
            >
              <a
                className={cn({
                  'has-text-link': person.sex === 'm',
                  'has-text-danger': person.sex === 'f',
                })}
                href={person.name}
                onClick={(event) => {
                  event.preventDefault();
                  setSelectedPerson(person);
                  handleQueryChange(person.name);
                  setIsSelected(true);
                }}
              >
                {person.name}
              </a>
            </div>
          </div>
        );
      })}

    </div>
  );
};
