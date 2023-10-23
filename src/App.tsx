import classNames from 'classnames';
import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [people] = useState<Person[] | []>([...peopleFromServer]);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Person | null>(null);

  // eslint-disable-next-line @typescript-eslint/ban-types
  function debounce(callback: Function, delay: number) {
    let timerId = 0;

    return (...args: any) => {
      window.clearTimeout(timerId);

      timerId = window.setTimeout(() => {
        callback(...args);
        setIsActive(true);
      }, delay);
    };
  }

  const applyQuery = useCallback(debounce(setAppliedQuery, 800), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsActive(false);
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    return people.filter(person => {
      return person.name.toLowerCase().trim()
        .includes(appliedQuery.toLowerCase().trim());
    });
  }, [appliedQuery, people]);

  const handleDropdownClick = () => {
    setIsActive(!isActive);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleDropdownClick();
    }

    if (event.key === 'Escape') {
      setIsActive(false);
    }
  };

  const handleOutsideClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isActive && event.target && !(event.target as HTMLElement)
      .closest('.dropdown')) {
      setIsActive(false);
    }
  };

  const handleSelectItem = (event: React.MouseEvent, person: Person) => {
    event.preventDefault();

    setSelectedItem(person);
    setQuery(person.name);
    setAppliedQuery(person.name);
    setIsActive(false);
  };

  const handleReset = () => {
    setSelectedItem(null);
    setQuery('');
    setAppliedQuery('');
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <main
      className="section"
      onClick={handleOutsideClick}
    >
      <h1 className="title">
        {selectedItem ? (
          <article className="message is-success">
            <div className="message-header">
              <p>{`${selectedItem?.name} (${selectedItem?.born} = ${selectedItem?.died})`}</p>
              <button
                type="button"
                className="delete"
                aria-label="delete"
                onClick={handleReset}
              />
            </div>
          </article>
        ) : (
          <article className="message is-warning">
            <div className="message-header">
              <p>No selected person</p>
            </div>
          </article>
        )}
      </h1>

      <div
        className={classNames('dropdown', { 'is-active': isActive })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className={classNames(
              'input',
              { 'is-danger': !filteredPeople.length },
            )}
            onChange={handleQueryChange}
            onClick={handleDropdownClick}
            onKeyDown={handleKeyDown}
            value={query}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.length ? (
              <>
                {filteredPeople.map(person => (
                  <a
                    href={`/${person.slug}`}
                    className="dropdown-item"
                    onClick={(event) => handleSelectItem(event, person)}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </a>
                ))}
              </>
            ) : (
              <a
                href="/"
                className="dropdown-item disabled-link"
              >
                <p className="is-danger">
                  No matching suggestions
                </p>
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
