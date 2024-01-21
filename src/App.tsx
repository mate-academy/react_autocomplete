import React, { useCallback, useState } from 'react';
import './App.scss';
import cn from 'classnames';
import debounce from 'debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropDownList } from './Components/DropDownList';
import { Input } from './Components/Input';

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [delayQuery, setDelayQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const applyQuery = useCallback(
    debounce((value: string) => setDelayQuery(value), 1000),
    [],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setIsVisible(true);
  };

  const onClick = (event: React.MouseEvent, person: Person) => {
    event.preventDefault();
    setQuery(person.name);
    setDelayQuery(person.name);
    setIsVisible(false);
    setSelectedPerson(person);
  };

  const delayOnBlur = () => {
    setTimeout(() => setIsVisible(false), 100);
  };

  const filteredPeople = (people: Person[], queryFilter: string) => {
    const normalizedQuery = queryFilter.toLowerCase();

    return people.filter(
      person => person.name.toLowerCase().includes(normalizedQuery),
    );
  };

  const reset = () => {
    setQuery('');
    setSelectedPerson(null);
    setDelayQuery('');
  };

  const preparedPeople = filteredPeople(peopleFromServer, delayQuery);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className={cn('dropdown', { 'is-active': isVisible })}>
        <Input
          query={query}
          handleInputChange={handleInputChange}
          delayOnBlur={delayOnBlur}
          selectedPerson={selectedPerson}
          reset={reset}
          setIsVisible={() => setIsVisible(true)}
        />

        <div className="dropdown-menu" role="menu">
          <DropDownList people={preparedPeople} onClick={onClick} />
        </div>
      </div>
    </main>
  );
};
