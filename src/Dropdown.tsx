import React, { useMemo, useState } from 'react';
import { Person } from './types/Person';
import cn from 'classnames';
import debounce from 'lodash.debounce';

type Props = {
  delay: number;
  people: Person[];
  onSelected: (person: Person | null) => void;
};

export const Dropdown: React.FC<Props> = ({ delay, people, onSelected }) => {
  const [inputValue, setInputValue] = useState('');
  const [visible, setVisible] = useState(false);

  const debounceName = useMemo(
    () => debounce(() => setVisible(true), delay),
    [delay],
  );

  const filteredPeople = useMemo(() => {
    return people.filter(person => {
      const fixedText = inputValue.toLocaleLowerCase().trim();

      return person.name.toLowerCase().includes(fixedText);
    });
  }, [people, inputValue]);

  const handleSelectPerson = (person: Person) => {
    onSelected(person);
    setInputValue(person.name);
    setVisible(false);
  };

  const handleInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    debounceName();
    setInputValue(event.target.value);
    onSelected(null);
    setVisible(false);
  };

  return (
    <>
      <div className={cn('dropdown', { 'is-active': visible })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={inputValue}
            onChange={handleInputValue}
            onFocus={() => setVisible(true)}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          {filteredPeople.length > 0 && (
            <div className="dropdown-content">
              {visible &&
                filteredPeople.map(person => (
                  <div
                    key={person.slug}
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    onClick={() => handleSelectPerson(person)}
                  >
                    <p
                      className={cn({
                        'has-text-link': person.sex === 'm',
                        'has-text-danger': person.sex === 'f',
                      })}
                    >
                      {person.name}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {!filteredPeople.length && (
        <div
          className="
          notification
          is-danger
          is-light
          mt-3
          is-align-self-flex-start
        "
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
