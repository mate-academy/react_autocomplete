import { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { Person } from '../../types/Person';
import { PeopleList } from '../PeopleList/PeopleList';
import { peopleFromServer } from '../../data/people';

type Prop = {
  delay: number,
};

export const Autocomplete: React.FC<Prop> = ({
  delay,
}) => {
  const allPeople: Person[] = peopleFromServer;

  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState<string>('');
  const [applyQuery, setApplyQuery] = useState<string>('');

  const filteredPeople = useMemo(() => allPeople.filter(
    person => person.name.toLowerCase().includes(query.toLowerCase().trim()),
  ), [applyQuery, allPeople]);

  const applySearch = useCallback(
    debounce(setApplyQuery, delay),
    [delay],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applySearch(event.target.value);
  };

  const handleSelectPerson = useCallback((person: Person) => {
    setQuery('');
    setSelectedPerson(person);
  }, []);

  return (
    <main className="section">
      {selectedPerson ? (
        <h1
          className={classNames('title', {
            'has-text-danger': selectedPerson?.sex === 'f',
            'has-text-link': selectedPerson?.sex === 'm',
          })}
        >
          {`${selectedPerson?.name} (${selectedPerson?.born} - ${selectedPerson?.died})`}
        </h1>
      ) : (
        <h1 className="title">
          No selected person
        </h1>
      )}

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            value={query}
            placeholder="Enter a part of the name"
            className="input"
            onChange={handleInputChange}
          />
        </div>

        <button
          type="button"
          onClick={() => setQuery('')}
        >
          X
        </button>

        {(query && query === applyQuery) && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {filteredPeople.length === 0 ? (
                <p>No matching suggestions</p>
              ) : (
                <PeopleList
                  people={filteredPeople}
                  onSelectPerson={handleSelectPerson}
                  onQuery={setQuery}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
