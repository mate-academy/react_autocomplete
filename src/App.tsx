import { useState, useRef } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';
import { Autocomplete } from './components/autocomplete';
import { NoMatch } from './components/nomatch';

export const App: React.FC = () => {
  const initialPerson: Person = {
    name: '',
    born: 0,
    died: 0,
    slug: '',
    fatherName: '',
    motherName: '',
    sex: 'm',
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

  const handleDropdownClick = (a: boolean) => {
    setTimeout(() => {
      setIsDropdownActive(a);
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

  const debounceFilter = debounce(filterPeople, 1000);
  const handleQueryChange = () => {
    setSelectedPerson(initialPerson);
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
      setSelectedPerson(person as Person);
      inputRef.current.value = person.name;
    }
  };

  const conditionShowDropdown =
    suggestions.length !== 0 &&
    isDropdownActive &&
    selectedPerson.name === initialPerson.name;

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
              onFocus={() => handleDropdownClick(true)}
              onBlur={() => handleDropdownClick(false)}
            />
          </div>

          <Autocomplete
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
