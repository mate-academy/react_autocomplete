import classNames from 'classnames';
import { Person } from '../types/Person';
import React, { useCallback, useEffect, useRef } from 'react';

type Props = {
  people: Person[];
  selectedPerson: Person | null;
  visiable: boolean;
  inputText: string;
  onType: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect: (person: Person) => void;
  onChange: (value: boolean) => void;
};

export const Autocomplete: React.FC<Props> = React.memo(
  ({
    people,
    selectedPerson,
    visiable,
    inputText,
    onType,
    onSelect,
    onChange,
  }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const handleClickOutside = useCallback(
      (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          onChange(false);
        }
      },
      [onChange],
    );

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [handleClickOutside]);

    return (
      <div
        className={classNames('dropdown', {
          'is-active': visiable && people.length,
        })}
        ref={dropdownRef}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={inputText}
            onChange={onType}
            onFocus={() => onChange(true)}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {people.map(person => {
              const { name } = person;

              return (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={name}
                >
                  <a
                    className={classNames('has-text-link link', {
                      'has-text-danger': selectedPerson === person,
                    })}
                    onClick={() => onSelect(person)}
                  >
                    {name}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  },
);
