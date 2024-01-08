import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import cn from 'classnames';
import './Autocomplete.scss';
import debounce from 'lodash.debounce';

import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';

type Props = {
  onSelect: (person: Person | null) => void,
  delay: number,
};

export const Autocomplete: React.FC<Props> = React.memo(({
  delay,
  onSelect,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocus, setIsFocus] = useState(false);
  const [isSuggestion, setIsSuggestion] = useState(true);

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const filteredPeople = useMemo(() => {
    const list = peopleFromServer
      .filter((el: Person) => {
        return el.name.toLocaleLowerCase().includes(appliedQuery.toLowerCase());
      });

    setIsSuggestion(!!list.length);
    setIsFocus(isSuggestion);

    return list;
  }, [appliedQuery, isSuggestion]);

  const handleSelectPerson = useCallback((selectedPerson: Person) => {
    onSelect(selectedPerson);
    setQuery(selectedPerson.name);
  }, [onSelect, setQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  useEffect(() => {
    document.addEventListener('click', event => {
      if (event.target instanceof HTMLInputElement) {
        return;
      }

      setIsFocus(false);
    });
  }, []);

  return (
    <div className="dropdown">
      {!isSuggestion && (
        <p className="is-$blue">No matching suggestions</p>
      )}

      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        value={query}
        onChange={handleQueryChange}
        onFocus={() => setIsFocus(true)}
      />
      <div className={cn('dropdown', {
        'is-active': isFocus,
      })}
      >
        <div
          className="dropdown-menu"
          id="dropdown-menu"
          role="menu"
        >
          <div className="dropdown-content">
            {filteredPeople.map((person: Person) => (
              <button
                type="button"
                className="dropdown-item"
                key={person.slug}
                onClick={() => handleSelectPerson(person)}
              >
                {person.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
});
