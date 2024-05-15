import { memo, useEffect, useMemo, useRef, useState } from 'react';
import React from 'react';
import debounce from 'lodash.debounce';
import './Autocomplete.scss';
import { peopleFromServer } from '../data/people';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  delay?: number;
  width?: number;
  onSelected: (Person: Person | '') => void;
  onWarning: (a: boolean) => void;
};

export const Autocomplete: React.FC<Props> = memo(
  ({ delay = 300, width = 300, onSelected, onWarning }) => {
    const [query, setQuery] = useState('');
    const [appliedQuery, setAppliedQuery] = useState('');
    const [showDrop, setShowDrop] = useState(true);
    const [isFirstRender, setIsFirstRender] = useState(true);

    const debouncedApplyQuery = useRef(
      debounce((value: string) => {
        setAppliedQuery(value);
      }, delay),
    ).current;

    useEffect(() => {
      return () => {
        debouncedApplyQuery.cancel();
      };
    }, [debouncedApplyQuery]);

    const filteredPeople = useMemo(() => {
      return peopleFromServer.filter(person =>
        person.name
          .toLocaleLowerCase()
          .includes(appliedQuery.toLocaleLowerCase()),
      );
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
    }, [filteredPeople, isFirstRender, onWarning]);

    const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      onSelected('');
      setShowDrop(false);
      setQuery(value);
      debouncedApplyQuery(value);
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
      <div className="dropdown is-active" style={{ width }}>
        <div className="dropdown-trigger width-trigger">
          <input
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
          className={classNames('dropdown-menu', { 'is-hidden': showDrop })}
          style={{ width }}
          role="menu"
          data-cy="suggestions-list"
          id="dropdown-menu"
        >
          <div className="dropdown-content max-height-dropdown">
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
  },
);
