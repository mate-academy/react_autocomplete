import React, { useState, useMemo } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isShowDropDown, setIsShowDropdown] = useState(false);
  const [selectedPersonName, setSelectedPersonName] = useState('');

  const applyQuery = useMemo(() => debounce(setAppliedQuery, delay), [delay]);

  React.useEffect(() => {
    return () => {
      applyQuery.cancel();
    };
  }, [applyQuery]);

  const filtredList = useMemo(() => {
    if (!appliedQuery.trim() && isShowDropDown) {
      return people;
    }

    if (appliedQuery.trim()) {
      return people.filter(person => {
        return person.name
          .toUpperCase()
          .includes(appliedQuery.toUpperCase().trim());
      });
    }

    return [];
  }, [appliedQuery, people, isShowDropDown]);

  const notHaveSuggestion =
    appliedQuery.trim() !== '' && filtredList.length === 0;

  function handleQuery(event: React.ChangeEvent<HTMLInputElement>) {
    const newQuery = event.target.value;

    setQuery(newQuery);
    applyQuery(newQuery);

    if (selectedPersonName && newQuery !== selectedPersonName) {
      setSelectedPersonName('');
      onSelected(null);
    }

    if (!isShowDropDown) {
      setIsShowDropdown(true);
    }
  }

  function handleSelected(person: Person) {
    onSelected(person);
    setIsShowDropdown(false);
    setQuery(person.name);
    setAppliedQuery(person.name);
    setSelectedPersonName(person.name);
  }

  return (
    <>
      <div
        className={classNames('dropdown', {
          'is-active': isShowDropDown,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            onChange={handleQuery}
            value={query}
            onFocus={() => setIsShowDropdown(true)}
            onBlur={() => {
              setTimeout(() => {
                setIsShowDropdown(false);
              }, 200);
            }}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filtredList.map(person => {
              return (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={person.slug}
                  onMouseDown={e => {
                    e.preventDefault();
                    handleSelected(person);
                  }}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {notHaveSuggestion && (
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
