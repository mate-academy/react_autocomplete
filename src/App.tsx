import { useState, useRef } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';
import DropdownMenu from './components/DropdownMenu';
import NoMatch from './components/NoMatch';

export const App: React.FC = () => {
  const initialPerson: Person = {
    name: '',
    born: 0,
    died: 0,
    slug: '',
    fatherName: '',
    motherName: '',
  };

  const [selectedPerson, setSelectedPerson] = useState<Person>(initialPerson);
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [suggestions, setSuggestions] = useState<Person[]>(peopleFromServer);

  const { name, born, died } = selectedPerson;

  const titleText =
    selectedPerson.name !== initialPerson.name
      ? `${name} (${born} - ${died})`
      : 'No selected person';

  const inputRef = useRef<HTMLInputElement>(null);

  const filterPeople = () => {
    const inputValue = inputRef.current?.value.toLowerCase() || '';

    setSuggestions(
      peopleFromServer.filter(person =>
        person.name.toLowerCase().includes(inputValue.trim()),
      ),
    );

    setIsDropdownActive(true);
  };

  const debounceFilter = debounce(filterPeople, 1000);
  const handleQueryChange = () => {
    setSelectedPerson(initialPerson);
    debounceFilter();
    setIsDropdownActive(false);
  };

  const selectPersonFromTheList = (
    event: React.MouseEvent<HTMLParagraphElement>,
  ) => {
    const selectedPersonName = event.currentTarget.textContent;

    const person = peopleFromServer.find(
      targetPerson => targetPerson.name === selectedPersonName,
    );

    if (person && inputRef.current) {
      setSelectedPerson(person as Person);
      inputRef.current.value = person.name;
    }
  };

  const handleDropdownClick = () => {
    setIsDropdownActive(!isDropdownActive);
  };

  const conditionShowDropdown = suggestions.length !== 0 && isDropdownActive;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {titleText}
        </h1>
        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              defaultValue=""
              onChange={handleQueryChange}
              data-cy="search-input"
              onFocus={handleDropdownClick}
            />
          </div>

          <DropdownMenu
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
