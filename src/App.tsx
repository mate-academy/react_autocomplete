import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { DropDownItem } from './components/DropDownItem';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const delay = 1000;

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), [delay]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value.trim());
  };

  const handlePersonSelect = (person: Person | null) => {
    setSelectedPerson(person);
    setQuery(person ? person.name : '');
    setAppliedQuery(person ? person.name : '');
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(
      (person) => person.name.toLowerCase()
        .includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  let content = null;

  if (filteredPeople.length && isFocused) {
    content = filteredPeople.map((person) => (
      <DropDownItem
        onSelect={handlePersonSelect}
        key={person.slug}
        person={person}
        setQuery={setQuery}
        setAppliedQuery={setAppliedQuery}
        selectedPerson={selectedPerson}
      />
    ));
  } else if (!filteredPeople.length && isFocused) {
    content = <p className="message">No matching suggestions</p>;
  }

  const { name, born, died } = selectedPerson || {};

  const dropDownRef = useRef<HTMLDivElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (dropDownRef.current && !dropDownRef.current
      .contains(event.target as Node)) {
      setIsFocused(false);
    } else {
      setIsFocused(true);
    }
  };

  return (
    <main
      className="section"
      role="presentation"
      onClick={handleClick}
    >
      <h1 className="title">
        {selectedPerson
          ? (
            `${name} (${born} - ${died})`
          )
          : (
            'No person selected'
          )}
      </h1>

      <div className="dropdown is-active" ref={dropDownRef}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {content}
          </div>
        </div>
      </div>
    </main>
  );
};
