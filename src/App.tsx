import React, { useCallback, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Autocomplete } from './Autocomplete';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

interface Props {
  debounceDelay?: number;
}

export const App: React.FC<Props> = ({ debounceDelay = 300 }) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [focus, setFocus] = useState(false);
  const [match, setMatch] = useState(true);
  const [search, setSearch] = useState('');
  const [people, setPeople] = useState(peopleFromServer);

  const debouncedFilter = useCallback(
    debounce((searchTerm: string) => {
      if (searchTerm.trim() === '') {
        setPeople(peopleFromServer);

        return;
      }

      const filteredPeople = peopleFromServer.filter(person =>
        person.name.trim().toLowerCase().includes(searchTerm.toLowerCase()),
      );

      setPeople(filteredPeople);
      setMatch(filteredPeople.length > 0);
    }, debounceDelay),
    [debounceDelay],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearch = event.target.value.trim();

    if (newSearch === search) {
      return;
    }

    setSearch(newSearch);
    setSelectedPerson(null);
    debouncedFilter(newSearch);
  };

  // eslint-disable-next-line no-console
  console.log(people);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              value={selectedPerson?.name}
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
              onChange={handleChange}
            />
          </div>
          <Autocomplete
            people={people}
            onSelect={setSelectedPerson}
            focus={focus}
            match={match}
          />
        </div>
      </main>
    </div>
  );
};
