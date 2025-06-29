import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import classNames from 'classnames';

interface Props {
  people: Person[];
  onSelected: (person: Person) => void;
}

const AutoComplete: React.FC<Props> = memo(function AutoComplete({
  people,
  onSelected,
}) {
  return (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {people.map(person => {
          return (
            <a
              href="#"
              key={person.name}
              className="dropdown-item"
              data-cy="suggestion-item"
              onClick={() => onSelected(person)}
            >
              <p className="has-text-danger">{person.name}</p>
            </a>
          );
        })}
      </div>
    </div>
  );
});

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [visibleList, setVisibleList] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const delayRef = useRef(300);

  const applyQuery = useMemo(() => {
    return debounce(setAppliedQuery, delayRef.current);
  }, []);

  useEffect(() => {
    return () => {
      applyQuery.cancel();
    };
  }, [applyQuery]);

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter((person: Person) => {
      return person.name.toLowerCase().includes(appliedQuery.toLowerCase());
    });
  }, [appliedQuery]);

  const handleQueryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value);
      applyQuery(e.target.value);
    },
    [applyQuery],
  );

  const handleSelectedPerson = useCallback((person: Person) => {
    setSelectedPerson(person);
    setQuery(person.name);
    setVisibleList(false);
  }, []);

  const handleFocus = useCallback(() => {
    setQuery('');
    setAppliedQuery('');
    setVisibleList(true);
    setSelectedPerson(null);
  }, []);

  const title = useMemo(() => {
    return selectedPerson
      ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
      : 'No selected person';
  }, [selectedPerson]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {title}
        </h1>

        <div className={classNames('dropdown', { 'is-active': visibleList })}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
              onFocus={handleFocus}
            />
          </div>
          {visibleList && filteredPeople.length > 0 && (
            <AutoComplete
              people={filteredPeople}
              onSelected={value => handleSelectedPerson(value)}
            />
          )}
        </div>
        {visibleList && filteredPeople.length === 0 && (
          <div
            className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
