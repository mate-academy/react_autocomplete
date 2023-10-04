import React, {
  useState, useCallback, useMemo,
} from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import cn from 'classnames';
import { peopleFromServer } from './data/people';
import { PeopleList } from './components/PeopleList/PeopleList';
import { Person } from './types/Person';

interface Props {
  delay?: number;
}

const people = peopleFromServer.map((post, index) => ({
  ...post,
  id: index + 1,
}));

export const App: React.FC<Props> = ({ delay }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showPeopleList, setShowPeopleList] = useState(false);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [delay],
  );

  const handleChangePerson = useCallback(
    (person: Person) => {
      setSelectedPerson(person);
      setQuery(person.name);
      setShowPeopleList(false);
    },
    [],
  );

  const handleFocus = useMemo(() => () => {
    setShowPeopleList(true);
  }, []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = event.target.value;

    setQuery(inputText);
    applyQuery(inputText);

    if (inputText.trim() === '') {
      setSelectedPerson(null);
    }
  };

  const filteredPeople = useMemo(() => {
    return people.filter(person => person.name.toLocaleLowerCase().trim()
      .includes(appliedQuery.toLowerCase().trim()));
  }, [appliedQuery, people]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`
          : 'No selected person'}
      </h1>

      <div className={cn('dropdown', { 'is-active': showPeopleList })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={handleFocus}
          // onBlur={handleBlur}
          />
        </div>

        <PeopleList
          peopleList={filteredPeople}
          onSelected={handleChangePerson}
        />
      </div>
    </main>
  );
};
