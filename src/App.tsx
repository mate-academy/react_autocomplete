import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropdownMenu } from './DropdownMenu/DropdownMenu';
import { Person } from './types/Person';
import debounce from 'lodash.debounce';

type Props = {
  delay: number;
};

export const App: React.FC<Props> = ({ delay = 300 }) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [focus, setFocus] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const dropDown = useRef<HTMLDivElement>(null);

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);

  const onClick = useCallback((person: Person) => {
    setSelectedPerson(person);
    setAppliedQuery(person.name);
    setQuery(person.name);
    setFocus(false);
  }, []);

  const debounceOnChange = useMemo(
    () =>
      debounce((value: string) => {
        setQuery(value);
      }, delay),
    [delay],
  );

  useEffect(() => {
    return () => {
      debounceOnChange.cancel();
    };
  }, [debounceOnChange]);

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setAppliedQuery(event.target.value);
      debounceOnChange(event.target.value);
      setSelectedPerson(null);
    },
    [debounceOnChange],
  );

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {!selectedPerson
            ? 'No selected person'
            : `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`}
        </h1>

        <div className={'dropdown is-active'} tabIndex={0} ref={dropDown}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              value={appliedQuery}
              data-cy="search-input"
              onChange={onChange}
              onFocus={() => setFocus(true)}
              onBlur={() => setFocus(false)}
            />
          </div>
          {focus && filteredPeople.length !== 0 && (
            <DropdownMenu people={filteredPeople} onClick={onClick} />
          )}
        </div>

        {filteredPeople.length === 0 && (
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
