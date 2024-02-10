import { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';

import { Person } from '../../types/Person';
import { peopleFromServer } from '../../data/people';
import { debounce } from '../../utils/debounce';
import { filterPeopleList } from '../../utils/filterList';

type Props = {
  onSelected: (person: Person | null) => void;
  autocompleteDelay?: number;
};

export const Autocomplete: React.FC<Props> = ({
  onSelected,
  autocompleteDelay = 300,
}) => {
  const [searchPerson, setSearchPerson] = useState('');
  const [appliedSearchPerson, setAppliedSearchPerson] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  const suggestions: Person[] = useMemo(
    () => filterPeopleList(peopleFromServer, appliedSearchPerson),
    [appliedSearchPerson],
  );

  const handleAppliedSearch = (str: string) => {
    setAppliedSearchPerson(str);
    setShowAutocomplete(true);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applySearch = useCallback(
    debounce(handleAppliedSearch, autocompleteDelay),
    [],
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowAutocomplete(false);
    onSelected(null);
    setSearchPerson(event.target.value);
    applySearch(event.target.value);
  };

  const handlePick = (chosenPerson: Person) => {
    if (chosenPerson.name === appliedSearchPerson) {
      setShowAutocomplete(false);

      return;
    }

    onSelected(chosenPerson);
    setSearchPerson(chosenPerson.name);
    setAppliedSearchPerson(chosenPerson?.name);
    setShowAutocomplete(false);
  };

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={searchPerson}
            onChange={handleSearch}
            onFocus={() => setShowAutocomplete(true)}
            onBlur={(e) => {
              if (!e.relatedTarget) {
                setShowAutocomplete(false);
              }
            }}
          />
        </div>

        {showAutocomplete && !!suggestions.length && (
          <div
            className="dropdown-menu"
            role="menu"
            data-cy="suggestions-list"
          >
            <div className="dropdown-content">
              {suggestions.map((human) => (
                <button
                  type="button"
                  className="dropdown-item button is-white"
                  data-cy="suggestion-item"
                  key={human.slug}
                  onClick={() => handlePick(human)}
                >
                  <p
                    className={classNames({
                      'has-text-link': human.sex === 'm',
                      'has-text-danger': human.sex === 'f',
                    })}
                  >
                    {human.name}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {showAutocomplete && !suggestions.length && (
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
    </>
  );
};
