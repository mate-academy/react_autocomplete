import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { Person } from '../../types/Person';
import debounce from 'lodash.debounce';
import { UserDropDownMenu } from './UserDropDownMenu';

type Props = {
  items: Person[];
  onSelected: (person: Person | null) => void;
  delay: number;
};

export const UserDropDown = ({ items, onSelected, delay }: Props) => {
  const [query, setQuery] = useState('');
  const [selectQuery, setSelectQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter(item =>
      item.name.trim().toLowerCase().includes(selectQuery.toLowerCase()),
    );
  }, [selectQuery, items]);

  const changeSelectedQuery = useCallback(
    debounce((value: string) => {
      setSelectQuery(value);
    }, delay),
    [delay],
  );

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    changeSelectedQuery(event.target.value);
    onSelected(null);
  };

  const handlePasteItem = useCallback((item: Person) => {
    setQuery(item.name);
    onSelected(item);
    setIsOpen(false);
  }, []);

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleInputChange}
            onFocus={() => {
              setIsOpen(true);
            }}
            onBlur={() => {
              setIsOpen(false);
            }}
            data-cy="search-input"
          />
        </div>

        {isOpen && filteredItems.length > 0 && (
          <UserDropDownMenu
            filteredItems={filteredItems}
            handlePasteItem={handlePasteItem}
          />
        )}
      </div>

      {!filteredItems.length && (
        <div
          className="notification
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
