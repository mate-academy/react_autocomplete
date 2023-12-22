/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { ChangeEvent, useMemo, useState } from 'react';
import './App.scss';
import classNames from 'classnames';
import { useDebouncedCallback } from 'use-debounce';
import useOnClickOutside from 'use-onclickoutside';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [inputValueDeb, setInputValueDeb] = useState('');

  const ref = React.useRef(null);

  useOnClickOutside(ref, () => setIsOpen(false));

  const { name, born, died } = selectedPerson || {};

  const filteredPeople = useMemo(() => {
    if (inputValueDeb) {
      return peopleFromServer.filter(
        person => person.name
          .toLocaleLowerCase()
          .includes(inputValueDeb.toLocaleLowerCase()),
      );
    }

    return peopleFromServer;
  }, [inputValueDeb]);

  const debounced = useDebouncedCallback(
    (value) => {
      setInputValueDeb(value);
      setIsOpen(true);
    },
    500,
  );

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    setInputValue(person.name);
    setIsOpen(false);
  };

  const handleChangeText = (e: ChangeEvent<HTMLInputElement>) => {
    setIsOpen(false);
    setInputValue(e.target.value);
    debounced(e.target.value);
  };

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? `${name} (${born} = ${died})` : 'No selected person'}
      </h1>

      <div className={classNames('dropdown', {
        'is-active': isOpen,
      })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={inputValue}
            onChange={handleChangeText}
            onFocus={() => setIsOpen(true)}
          />
        </div>

        <div
          className="dropdown-menu"
          role="menu"
          ref={ref}
        >
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div className="dropdown-item" key={person.slug}>
                <p
                  className="has-text-link"
                  onClick={() => handleSelectPerson(person)}
                >
                  {person.name}
                </p>
              </div>
            ))}
            {!filteredPeople.length && (
              <div className="dropdown-item">
                No matching suggestions
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
