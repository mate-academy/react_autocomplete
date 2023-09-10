import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { SearchBar } from './component/SearchBar';

const preparedPeople = [...peopleFromServer];

export const App: React.FC = () => {
  const [people] = useState(preparedPeople);
  const [filteredPeople, setFilteredPeople] = useState(people);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const inputField = useRef<HTMLInputElement>(null);

  const { name, born, died } = filteredPeople?.length
    ? filteredPeople[0] : { name: '', born: '', died: '' };

  const filterPeople = useMemo(() => {
    return people.filter(person => person.name
      .toUpperCase().includes(appliedQuery.trim().toUpperCase()));
  }, [appliedQuery, people]);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 500),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);

    setFilteredPeople(filterPeople);

    applyQuery(event.target.value);
  };

  return (
    <main className="section">
      <h1 className="title">
        {query
          ? `${name} (${born} = ${died})`
          : 'No matching suggestions'}

      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <div className="field">
            <p className="control is-expanded has-icons-right">
              <input
                onFocus={() => {
                  setFocused(true);
                }}
                onBlur={() => {
                  setFocused(false);
                }}
                ref={inputField}
                type="text"
                placeholder="Enter a part of the name"
                className="input"
                aria-haspopup="true"
                aria-controls="dropdown-menu"
                value={query}
                onChange={handleQueryChange}
              />
              <span className="icon is-small is-right">
                <i className="fas fa-search" />
              </span>
            </p>
          </div>
        </div>

        {focused && (
          <SearchBar filteredPeople={filteredPeople} />
        )}

      </div>
    </main>
  );
};
