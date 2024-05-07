import { useMemo, useRef, useState } from 'react';
import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';

type Props = {
  onSelected: (user: Person | null) => void;
  delay: number;
};
export const Autocomplete: React.FC<Props> = ({ onSelected, delay }) => {
  const [suggestionList, setSuggestionList] =
    useState<Person[]>(peopleFromServer);
  const [query, setQuery] = useState('');
  const [applayedQuery, setApplayedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const timerId = useRef(0);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onSelected(null);
    setSuggestionList([]);
    window.clearTimeout(timerId.current);

    timerId.current = window.setTimeout(() => {
      setApplayedQuery(event.target.value);
      setSuggestionList(peopleFromServer);
    }, delay);
  };

  const handleFocus = () => {
    setSuggestionList(peopleFromServer);
    setIsFocused(true);
    onSelected(null);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setSuggestionList([]);
    }, 200);
  };

  const handleClick = (person: Person) => {
    onSelected(person);
    setIsFocused(false);
    setQuery(person.name);
    setApplayedQuery('');
  };

  const filteredList = useMemo(() => {
    return suggestionList.filter(item =>
      item.name.toLowerCase().includes(applayedQuery.trim().toLowerCase()),
    );
  }, [applayedQuery, suggestionList]);

  return (
    <div className={`dropdown ${isFocused && 'is-active'}`}>
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
                const { name, slug } = person;

                return (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={slug}
                    onClick={() => handleClick(person)}
                  >
                    {person.sex === 'm' ? (
                      <p className="has-text-link">{name}</p>
                    ) : (
                      <p className="has-text-danger">{name}</p>
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
