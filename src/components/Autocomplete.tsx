import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';

import { Person } from '../types/Person';

type Props = {
  items: Person[],
  selectedItem: Person | null
  onSelected: (item: Person | null) => void,
  delay: number,
};

export const Autocomplete: React.FC<Props> = ({
  items,
  selectedItem,
  onSelected,
  delay,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isChanging, setIsChanging] = useState(false);

  const applyQuery = useCallback((value) => debounce(() => {
    setAppliedQuery(value);
    setIsChanging(false);
  }, delay)(), [delay]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChanging(true);

    onSelected(null);
    setQuery(e.target.value);
    applyQuery(e.target.value);
  };

  const handleSelectItem = (item: Person) => {
    onSelected(item);
    setQuery(item.name);
  };

  const filteredItems = useMemo(() => {
    return items.filter(
      p => p.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery, items]);

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleChange}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        {(!isChanging && !selectedItem) && (
          <div className="dropdown-content">
            { filteredItems.length
              ? filteredItems.map(item => (
                <div
                  className="dropdown-item"
                  key={item.name}
                >
                  <p
                    className="has-text-link"
                    role="presentation"
                    onClick={() => handleSelectItem(item)}
                  >
                    {item.name}
                  </p>
                </div>
              ))
              : 'No matching suggestions'}
          </div>
        )}
      </div>
    </div>
  );
};
