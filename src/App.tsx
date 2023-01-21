/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import cn from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC<{ delay?: number }> = ({ delay = 800 }) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);

  const { name, born, died } = selectedPerson || {} as Person;
  const lastQuery = useMemo(() => query, [timer]);

  useEffect(() => {
    const timerId = setTimeout(
      setTimer, delay, query.length,
    );

    setIsLoaded(lastQuery === query);

    return () => clearTimeout(timerId);
  }, [query]);

  useEffect(() => {
    setIsLoaded(true);
  }, [timer, isActive]);

  const visiblePeople = useMemo(() => {
    return isActive
      ? peopleFromServer.filter(person => (
        RegExp(query, 'i').test(person.name)
      ))
      : peopleFromServer;
  }, [timer]);

  const onFocus = useCallback(
    () => {
      setQuery('');
      setIsActive(true);
    },
    [],
  );

  const onSelect = useCallback(
    (person: Person) => {
      setSelectedPerson(person);
      setQuery(person.name);
      setIsActive(false);
    },
    [],
  );

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson?.slug
          ? `${name} (${born} - ${died})`
          : 'No selected person'}

        {selectedPerson && (
          // eslint-disable-next-line jsx-a11y/control-has-associated-label
          <button
            type="button"
            onClick={() => setSelectedPerson(null)}
            className="delete ml-3"
          />
        )}
      </h1>

      <div
        className={cn('dropdown', {
          'is-active': isActive,
        })}
      >
        <div
          className={cn('dropdown-trigger control', {
            'is-loading': !isLoaded,
          })}
        >
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={isActive ? query : name}
            onFocus={onFocus}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>

        <div
          className="dropdown-menu"
          role="menu"
        >
          {isLoaded && (
            <div className="dropdown-content">
              {visiblePeople.map(person => (
                <div key={person.slug} className="dropdown-item">
                  <p
                    className={cn('person', {
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                    onClick={() => onSelect(person)}
                  >
                    {person.name}
                  </p>
                </div>
              ))}

              {!visiblePeople.length && (
                <p className="person--alt">No matching suggestions</p>)}
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
