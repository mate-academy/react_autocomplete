import { useMemo, useRef, useState } from 'react';
import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';

type Props = {
  onSelected: (user: Person | null) => void;
  delay: number;
};
export const Autocomplete: React.FC<Props> = ({ onSelected, delay }) => {
  const [list, setList] = useState<Person[]>(peopleFromServer);
  const [query, setQuery] = useState('');
  const [applayedQuery, setApplayedQuery] = useState('');
  const [focused, setFocused] = useState(false);

  const timerId = useRef(0);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onSelected(null);
    setList([]);
    window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => {
      setApplayedQuery(event.target.value);
      setList(peopleFromServer);
    }, delay);
  };

  const handleFocus = () => {
    setList(peopleFromServer);
    setFocused(true);
    onSelected(null);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setList([]);
    }, 200);
  };

  const handleClick = (person: Person) => {
    onSelected(person);
    setFocused(false);
    setQuery(person.name);
    setApplayedQuery('');
  };

  const filteredList = useMemo(() => {
    return list.filter(item =>
      item.name.toLowerCase().includes(applayedQuery.trim().toLowerCase()),
    );
  }, [applayedQuery, list]);

  return (
    <div className={`dropdown ${focused && 'is-active'}`}>
      <div className="dropdown-trigger">
        <input
          value={query}
          onChange={handleQueryChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
        />
        {filteredList.length > 0 && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredList.map(person => {
                return (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.slug}
                    onClick={() => handleClick(person)}
                  >
                    {person.sex === 'm' ? (
                      <p className="has-text-link">{person.name}</p>
                    ) : (
                      <p className="has-text-danger">{person.name}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {filteredList.length === 0 && applayedQuery && (
          <div
            className="
            notification
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
      </div>
    </div>
  );
};
