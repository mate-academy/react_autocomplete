import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [searched, setSearched] = useState<string>('');
  const [people, setPeople] = useState<Person[]>(peopleFromServer);
  const [onSelected, setOnSelected] = useState<Person | null>(null);
  const [focus, setFocus] = useState<boolean>(false);
  const [debounceDelay] = useState<number>(200);

  const search = () => {
    const tmp = peopleFromServer.filter((person) => (
      person.name.toLowerCase().includes(searched.trim().toLocaleLowerCase())
    ));

    setPeople(tmp);
  };

  const debounce = <F extends (...args: any[]) => void>(
    func: F,
    delay: number,
  ) => {
    let timeoutId: NodeJS.Timeout;

    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const debouncedSearch = debounce(search, debounceDelay);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;

    // Don't run filtering again if the text has not changed
    if (newText === searched) {
      return;
    }

    setSearched(newText);
    setOnSelected(null);

    // Show the list of all people when input is focused but empty
    if (!newText) {
      setPeople(peopleFromServer);
    }

    debouncedSearch();
  };

  const handleItemClick = (selectedPerson: Person) => {
    // Save selected suggestion text to the input on click
    setSearched(selectedPerson.name);

    // Hide suggestions on text change
    setFocus(false);

    // Pass selected person to the onSelected callback
    setOnSelected(selectedPerson);
  };

  return (
    <main className="section">
      <h1 className="title">
        {!onSelected ? ('No selected person')
          : (`${onSelected.name} (${onSelected.born} = ${onSelected.died})`)}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a name"
            className="input"
            value={searched}
            onChange={handleInput}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          />
        </div>

        { focus && (
          <div className="dropdown-menu" role="menu">
            <ul className="dropdown-content">
              {people.length === 0 ? (
                <div className="dropdown-item">No matching suggestions</div>
              ) : (
                people.map((person) => (
                  /* eslint-disable-next-line */
                  <li
                    className="dropdown-item"
                    key={person.name}
                    onClick={() => handleItemClick(person)}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
};
