import React, { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { PeopleList } from '../PeopleSuggestions';
import { Person } from '../../types/Person';

type Props = {
  peopleList: Person[],
  onSelected: (person: Person) => void,
  delay?: number,
};

export const PeopleDropdown: React.FC<Props> = ({
  peopleList,
  onSelected,
  delay = 1000,
}) => {
  const [appliedQuery, setAppliedQuery] = React.useState('');
  const [query, setQuery] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value.trim());
  };

  const filteredPeople = useMemo(() => {
    return peopleList.filter(({ name }) => (
      name
        .toLowerCase()
        .startsWith(
          appliedQuery?.toLowerCase(),
        )
    ));
  }, [appliedQuery]);

  const onPersonSelect = (person: Person) => {
    setQuery('');
    setAppliedQuery('');
    onSelected(person);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
        />
      </div>

      {isInputFocused && (
        <div className="dropdown-menu" role="menu">
          <div
            className="dropdown-content"
          >
            {filteredPeople.length === 0 ? (
              <p>
                No matching suggestions
              </p>
            ) : (
              <PeopleList
                people={filteredPeople}
                onSelected={onPersonSelect}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
