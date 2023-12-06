import cn from 'classnames';
import debounce from 'lodash.debounce';
import React, { useCallback, useMemo, useState } from 'react';

import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';
import { Gender } from '../types/Gender';

type Props = {
  onSelect: (person: Person) => void,
  delay: number,
};

export const Autocomplete: React.FC<Props> = ({
  onSelect,
  delay,
}) => {
  const [visibleQuery, setVisibleQuery] = useState('');
  const [inputQuery, setInputQuery] = useState('');
  const [isListVisible, setIsListVisible] = useState(false);
  // eslint-disable-next-line
  const currentInputQuery = useCallback(
    debounce((value) => setInputQuery(value), delay),
    [setInputQuery, delay],
  );

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter((person: Person) => (
      person.name.toLowerCase().includes(inputQuery.trim().toLowerCase())
    ));
  }, [inputQuery]);

  const handleCurrentPerson = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => {
    event.preventDefault();
    setVisibleQuery(person.name);
    onSelect(person);
    setIsListVisible(false);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVisibleQuery(e.target.value);
    currentInputQuery(e.target.value);
    setIsListVisible(true);
  };

  const handleOnFocus = () => {
    if (!visibleQuery) {
      setIsListVisible(true);
    }
  };

  const handleOnBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (visibleQuery || inputQuery) {
      setVisibleQuery('');
      setInputQuery(e.target.value);
      currentInputQuery('');
    } else {
      setTimeout(() => {
        setIsListVisible(false);
      }, 100);
    }
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={visibleQuery}
          onChange={handleOnChange}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
        />
      </div>

      {isListVisible && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">

            {!filteredPeople.length && (
              <p className="dropdown-item has-text-primary">
                No matching suggestions
              </p>
            )}

            {filteredPeople.map(person => (
              <div className="dropdown-item">
                {/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions, jsx-a11y/anchor-is-valid */}
                <a
                  key={person.slug}
                  onClick={(e) => handleCurrentPerson(e, person)}
                  className={cn({
                    'has-text-danger': person.sex === Gender.female,
                    'has-text-link': person.sex === Gender.male,
                  })}
                >
                  {person.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
