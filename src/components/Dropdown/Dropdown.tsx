import React, { useCallback } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';

interface DropdownProps {
  people: Person[];
  debounceDelay: number;
  onSelected: (selectedPerson: Person) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  people,
  debounceDelay,
  onSelected,
}) => {
  const [query, setQuery] = React.useState('');
  const [appliedQuery, setAppliedQuery] = React.useState('');
  const [isInputFocused, setIsInputFocused] = React.useState(false);

  const setAppliedNonrepeatQuery = (e: string) => {
    if (query !== e) {
      setAppliedQuery(e);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(
    debounce(setAppliedNonrepeatQuery, debounceDelay),
    [debounceDelay],
  );

  const filteredPeople = React.useMemo(() => {
    return people.filter(person => person.name.includes(appliedQuery));
  }, [appliedQuery, people]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const handleItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    selected: Person,
  ) => {
    event.preventDefault();
    onSelected(selected);
    setQuery(selected.name);
    setIsInputFocused(false);
  };

  return (
    <div className={`dropdown ${isInputFocused && 'is-active'}`}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </div>

      {isInputFocused && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.map(item => (
              // eslint-disable-next-line jsx-a11y/no-static-element-interactions
              <div
                className="dropdown-item"
                key={item.name}
                onMouseDown={event => handleItemClick(event, item)}
              >
                <p className="has-text-link">{item.name}</p>
              </div>
            ))}

            {filteredPeople.length === 0 && (
              <div className="dropdown-item" key="No matching suggestions">
                <p className="has-text-link">No matching suggestions</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
