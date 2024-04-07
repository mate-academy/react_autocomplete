import React, { useEffect, useMemo, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';
import { PersonList } from '../PersonList/PersonList';

type Props = {
  people: Person[];
  onPersonSelect: (person: Person | null) => void;
  selectedPerson?: Person | null;
  onQuery: (query: string) => void;
  wait?: number;
};

const onQueryDefault = () => {};

export const Autocomplete: React.FC<Props> = ({
  people,
  onPersonSelect = () => null,
  selectedPerson = null,
  onQuery = onQueryDefault,
  wait = 300,
}) => {
  const [partOfName, setPartOfName] = useState(selectedPerson?.name || '');
  const [isListShown, setIsListShown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const showDropDownMenu = isListShown && people.length && !selectedPerson;

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

  const handleFocus = () => {
    setIsListShown(true);
  };

  const handleSuggestionClick = (person: Person) => {
    setIsListShown(true);
    onPersonSelect(person);
  };

  const handlerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPartOfName = event.target.value;

    setPartOfName(newPartOfName);
    setIsListShown(false);
    onPersonSelect(null);
  };

  useEffect(() => {
    handleQuery(partOfName);
  }, [handleQuery, partOfName]);

  useEffect(() => {
    document.addEventListener('click', listener);

    return () => document.removeEventListener('click', listener);
  }, [isListShown]);

  return (
    <>
      <div
        className="dropdown is-active"
        ref={dropdownRef}
        onFocus={handleFocus}
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

        {showDropDownMenu && (
          <PersonList
            handleSuggestionClick={handleSuggestionClick}
            people={people}
          />
        )}
      </div>
    </>
  );
};
