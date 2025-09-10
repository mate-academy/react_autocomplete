import React, { useRef, useState, useMemo } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import classNames from 'classnames';
import debounce from 'debounce';

type Person = {
  name: string;
  sex: string;
  born: number;
  died: number;
  fatherName: string | null;
  motherName: string | null;
  slug: string;
};

type AppProps = {
  debounceDelay?: number; // customizable via props
  onSelected?: (person: Person | null) => void; // 👈 new callback prop
};

export const App: React.FC<AppProps> = ({
  debounceDelay = 300,
  onSelected,
}) => {
  const [filteredPeople, setFilteredPeople] = useState(peopleFromServer);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  // remember last filtered term so we don’t refilter on same text
  const lastFiltered = useRef('');
  const debouncedFilter = useMemo(
    () =>
      debounce((value: string) => {
        if (value !== lastFiltered.current) {
          lastFiltered.current = value;
          if (value.trim() === '') {
            setFilteredPeople(peopleFromServer);
            return;
          }
          const filtered = peopleFromServer.filter(person =>
            person.name.toLowerCase().includes(value.toLowerCase()),
          );
          setFilteredPeople(filtered);
        }
      }, debounceDelay),
    [debounceDelay],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setOpenDropdown(true);
    setSelectedPerson(null); // clear previous selection
    if (onSelected) {
      onSelected(null); // notify parent that selection was cleared
    }
    debouncedFilter(value);
  };

  const choosePerson = (person: Person) => {
    setInputValue(person.name);
    setOpenDropdown(false);
    setSelectedPerson(person);
    if (onSelected) {
      onSelected(person); // notify parent about the new selected person
    }
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-qa="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div
          className={classNames('dropdown', { 'is-active': openDropdown })}
          data-qa="search-dropdown"
        >
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-qa="search-input"
              value={inputValue}
              onFocus={() => setOpenDropdown(true)}
              onChange={handleChange}
            />
          </div>
          {openDropdown && (
            <div
              className="dropdown-menu"
              id="search-dropdown-menu"
              role="menu"
            >
              <div className="dropdown-content">
                {filteredPeople.map(person => (
                  <a
                    className="dropdown-item"
                    key={person.slug}
                    onMouseDown={() => choosePerson(person)}
                  >
                    {person.name}
                  </a>
                ))}
                {filteredPeople.length === 0 && (
                  <div
                    className="
                      notification
                      is-danger
                      is-light
                      mt-3
                      is-align-self-flex-start
                    "
                    role="alert"
                    data-qa="no-suggestions-message"
                  >
                    <p className="has-text-danger">No matching suggestions</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
