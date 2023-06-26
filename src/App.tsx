import { useCallback, useMemo, useState } from 'react';
import { debounce } from 'lodash';
import './App.scss';
import { Autocomplete } from './components/Autocomplete';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

type Props = {
  delay: number;
};

export const App: React.FC<Props> = ({ delay = 1000 }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [showList, setShowList] = useState(true);
  const [onSelected, setOnSelected] = useState('No selected person');

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const getVisiblePeople = () => {
    return peopleFromServer
      .filter(person => person.name.toLocaleLowerCase()
        .includes(appliedQuery.toLocaleLowerCase()));
  };

  const visiplePeople = useMemo(
    getVisiblePeople,
    [peopleFromServer, appliedQuery],
  );

  const handlePersonSelect = (person: Person) => {
    setOnSelected(`${person.name} (${person.born} = ${person.died})`);
    setShowList(false);
    setQuery(person.name);
  };

  const handleInputChange = (inputValue: string) => {
    setQuery(inputValue);
    applyQuery(inputValue);
    setShowList(true);
  };

  return (
    <main className="section">
      <h1 className="title">
        {onSelected}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={e => handleInputChange(e.target.value)}
          />
        </div>

        {showList && (
          <Autocomplete
            people={visiplePeople}
            onPersonSelect={handlePersonSelect}
          />
        )}
      </div>
    </main>
  );
};
