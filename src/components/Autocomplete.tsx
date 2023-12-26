import debounce from 'lodash.debounce';
import { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';

type Props = {
  setSelectedItem: (a: Person) => void;
  delay: number;
};

export const Autocomplete: React.FC<Props> = ({ setSelectedItem, delay }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hoveredItem, setHoveredItem] = useState('');
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [delay],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

  const handleMouseEnter = (person: Person) => {
    setHoveredItem(person.name);
  };

  const handleMouseLeave = () => {
    setHoveredItem('');
  };

  const handleMouseDown = (person: Person) => {
    setSelectedItem(person);
    setQuery(person.name);
  };

  const filteredSuggestions: Person[]
  = useMemo(() => {
    return peopleFromServer.filter(
      (item) => item.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  return (
    <div className={classNames('dropdown', { 'is-active': isFocused })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          value={query}
          placeholder="Enter a part of the name"
          className="input"
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </div>
      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredSuggestions.length === 0 ? (
            <p className="dropdown-item">No matching suggestions</p>
          ) : (
            filteredSuggestions.map((person) => (
              <div
                className={classNames('dropdown-item', {
                  'has-background-light': hoveredItem === person.name,
                })}
                key={person.slug}
                role="button"
                tabIndex={0}
                onMouseEnter={() => handleMouseEnter(person)}
                onMouseLeave={handleMouseLeave}
                onMouseDown={() => {
                  handleMouseDown(person);
                }}
              >
                <p>{person.name}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
