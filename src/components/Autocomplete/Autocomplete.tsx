import React from "react"
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Person } from "../../types/Person";
import { peopleFromServer } from "../../data/people";
import debounce from "lodash.debounce";
import classNames from "classnames";

interface Props {
  delay?: number;
  width?: number;
  onSelected: (Person: Person | '') => void;
  onWarning: (a: boolean) => void;
}

export const AutoComplete: React.FC<Props> = memo(
  ({ delay = 300, width = 300, onSelected, onWarning }) => {
    const [query, setQuery] = useState('');
    const [appliedQuery, setAppliedQuery] = useState('');
    const [showDrop, setShowDrop] = useState(true);
    const [isFirstRender, setIsFirstRender] = useState(true);

    const filteredPeople = useMemo(() => {
      const filter = peopleFromServer.filter(person =>
        person.name
          .toLocaleLowerCase()
          .includes(appliedQuery.toLocaleLowerCase()),
      );

      return filter;
    }, [appliedQuery]);

    useEffect(() => {
      if (!isFirstRender) {
        if (filteredPeople.length === 0) {
          onWarning(true);
          setShowDrop(true);
        } else {
          onWarning(false);
          setShowDrop(false);
        }
      } else {
        setIsFirstRender(false);
      }
    }, [filteredPeople]);

    const applyQuery = useCallback(
      debounce((value: string) => {
        if (value !== query) {
          setAppliedQuery(value);
        }
      }, delay),
      [query],
    );

    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      onSelected('');
      setShowDrop(false);
      setQuery(value);
      applyQuery(value);
    };

    const handleSelectedItem = (item: Person) => {
      onSelected(item);
      setShowDrop(true);
      setQuery(item.name);
      setAppliedQuery(item.name);
    };

    const handleFocus = () => {
      setShowDrop(false);

      if (filteredPeople.length === 0) {
        setShowDrop(true);
      }
    };

    return (
      <div className="dropdown is-active" style={{ width: width }}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            aria-controls="dropdown-menu"
            aria-haspopup="true"
            value={query}
            onChange={handleChangeInput}
            onFocus={handleFocus}
            onBlur={() => setShowDrop(true)}
          />
        </div>

        <div
          className={classNames('dropdown-menu', {
            'is-hidden': showDrop,
          })}
          style={{ width: width }}
          role="menu"
          data-cy="suggestions-list"
        >
          <div className="dropdown-content">
            {filteredPeople.map(item => (
              <a
                className="dropdown-item"
                data-cy="suggestion-item"
                key={item.slug}
                onMouseDown={() => handleSelectedItem(item)}
              >
                <p
                  className={classNames({
                    'has-text-link': item.sex === 'm',
                    'has-text-danger': item.sex === 'f',
                  })}
                >
                  {item.name}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }
);