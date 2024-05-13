import { useState, useRef, useCallback } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';
import { AutoComplete } from './components/Autocomplete';
import { NoMatch } from './components/Nomatch';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [suggestions, setSuggestions] = useState<Person[]>(peopleFromServer);

  const { name, born, died } = selectedPerson || {
    name: '',
    born: '',
    died: '',
  };

  const titleText = selectedPerson
    ? `${name} (${born} - ${died})`
    : 'No selected person';

  const inputRef = useRef<HTMLInputElement>(null);

  const handleDropdownClick = (isActive: boolean) => {
    setTimeout(() => {
      setIsDropdownActive(isActive);
    }, 200);
  };

  const filterPeople = () => {
    const inputValue = inputRef.current?.value.toLowerCase() || '';

    setSuggestions(
      peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(inputValue.trim()),
      ),
    );

    handleDropdownClick(true);
  };

  const debounceFilter = useCallback(debounce(filterPeople, 1000), []);
  const handleQueryChange = () => {
    setSelectedPerson(null);
    debounceFilter();
    handleDropdownClick(false);
  };

  const selectPersonFromTheList = (
    event: React.MouseEvent<HTMLParagraphElement>,
  ) => {
    const selectedPersonName = event.currentTarget.textContent;

    const person = peopleFromServer.find(
      targetPerson => targetPerson.name === selectedPersonName,
    );

    if (person && inputRef.current) {
      setSelectedPerson(person);
      inputRef.current.value = person.name;
    }
  };

  const conditionShowDropdown =
    suggestions.length !== 0 && isDropdownActive && selectedPerson === null;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {titleText}
        </h1>
        <div className={`dropdown ${isDropdownActive ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              defaultValue=""
              onChange={handleQueryChange}
              data-cy="search-input"
              onFocus={() => handleDropdownClick(true)}
              onBlur={() => handleDropdownClick(false)}
            />
          </div>

          <AutoComplete
            suggestions={suggestions}
            conditionShowDropdown={conditionShowDropdown}
            selectPersonFromTheList={selectPersonFromTheList}
          />
        </div>

        {suggestions.length === 0 && <NoMatch />}
      </main>
    </div>
  );
};
