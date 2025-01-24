import React, { useCallback, useEffect, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import cn from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropDownMenu } from './components/DropDownMenu/DropDownMenu';

type Props = {
  delay?: number;
};

export const App: React.FC<Props> = ({ delay = 300 }) => {
  const [selectedOption, setSelectedOption] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const [isActiveInput, setIsActiveInput] = useState(false);

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), [delay]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value.trim();

    if (newQuery === '') {
      setQuery(event.target.value);
      setAppliedQuery('');
      applyQuery.cancel();

      return;
    }

    setQuery(event.target.value);
    applyQuery(newQuery);

    if (selectedOption && selectedOption.name !== event.target.value) {
      setSelectedOption(null);
    }
  };

  useEffect(() => {
    if (query.trim() !== '') {
      applyQuery(query.trim());
    }
  }, [query, applyQuery]);

  const filteredOptions = useMemo(() => {
    if (appliedQuery === '') {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  const hasNoMatches = filteredOptions.length === 0;

  const handleSelect = (option: Person) => {
    setSelectedOption(option);
    setQuery(option.name);
    setIsActiveInput(false);
  };

  const handleFocus = () => {
    setIsActiveInput(true);
  };

  const handleBlur = () => {
    setIsActiveInput(false);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedOption
            ? `${selectedOption.name} (${selectedOption.born} - ${selectedOption.died})`
            : 'No selected person'}
        </h1>

        <div className={cn('dropdown', { 'is-active': isActiveInput })}>
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={query}
              onChange={handleQueryChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          {!hasNoMatches && (
            <DropDownMenu options={filteredOptions} onSelect={handleSelect} />
          )}
        </div>

        {hasNoMatches && (
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
