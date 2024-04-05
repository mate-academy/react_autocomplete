import React, { useEffect, useMemo, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onPersonSelect?: (person: Person | null) => void;
  selectedPerson?: Person | null;
  onQuery?: (query: string) => void;
  wait?: number;
};

const onQueryDefault = () => {};

export const Autocomplete: React.FC<Props> = ({
  people,
  onPersonSelect = () => {},
  selectedPerson = null,
  onQuery = onQueryDefault,
  wait = 300,
}) => {
  const [partOfName, setPartOfName] = useState(selectedPerson?.name || '');
  const [isListShown, setIsListShown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleQuery = useMemo(
    () =>
      debounce<typeof onQuery>((...args) => {
        if (dropdownRef.current?.contains(document.activeElement)) {
          setIsListShown(true);
        }

        onQuery(...args);
      }, wait),
    [onQuery, wait],
  );

  useEffect(() => {
    handleQuery(partOfName);
  }, [handleQuery, partOfName]);

  useEffect(() => {
    const listener = ({ target }: MouseEvent) => {
      if (
        !(target instanceof HTMLElement) ||
        !dropdownRef.current ||
        dropdownRef.current.contains(target)
      ) {
        return;
      }

      setIsListShown(false);
    };

    document.addEventListener('click', listener);

    return () => document.removeEventListener('click', listener);
  }, [isListShown]);

  const handlerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPartOfName = event.target.value;

    setPartOfName(newPartOfName);
    setIsListShown(false);
    onPersonSelect(null);
  };

  return (
    <>
      <div
        className="dropdown is-active"
        ref={dropdownRef}
        onFocus={() => setIsListShown(true)}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            value={partOfName}
            onChange={handlerChange}
            className="input"
            data-cy="search-input"
          />
        </div>

        {Boolean(isListShown && people.length && !selectedPerson) && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {people.map(person => (
                <div
                  key={person.slug}
                  onClick={() => {
                    setIsListShown(true);
                    onPersonSelect(person);
                  }}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  tabIndex={1}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
