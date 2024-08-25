import React, { FC, useState } from 'react';
import { DropdownItem } from './components/DropdownItem';
import { Message } from './components/Message';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

type SetPersonForTitleProps = {
  setPersonForTitle: (person: Person | undefined) => void;
  people: Person[];
};

export const Autocomplete: FC<SetPersonForTitleProps> = ({
  setPersonForTitle,
  people,
}) => {
  const [filteredPersons, setFilteredPersons] = useState<Person[]>(people);
  const [value, setValue] = useState<string>('');
  const [focus, setFocus] = useState<boolean>(false);

  const appliedFilterPersons = debounce(setFilteredPersons, 300);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);

    appliedFilterPersons(
      people.filter(item =>
        item.name.toLowerCase().includes(event.target.value.toLowerCase()),
      ),
    );
    setPersonForTitle(people.find(item => item.name === event.target.value));
    setFocus(true);
  };

  const handleSelect = (name: string) => {
    setValue(name);
    appliedFilterPersons(
      people.filter(item =>
        item.name.toLowerCase().includes(name.toLowerCase()),
      ),
    );
    setPersonForTitle(people.find(item => item.name === name));
  };

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={value}
            onChange={handleChange}
            onFocus={() => setFocus(true)}
            onBlur={() => {
              setFocus(false);
            }}
          />
        </div>

        {focus && (
          <div
            className={`dropdown-menu`}
            role="menu"
            data-cy="suggestions-list"
          >
            <div className="dropdown-content">
              {filteredPersons.length ? (
                filteredPersons.map(pers => (
                  <DropdownItem
                    name={pers.name}
                    key={pers.name + pers.died}
                    onSelected={handleSelect}
                    onFocus={setFocus}
                  />
                ))
              ) : (
                <Message />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
