import cn from 'classnames';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { debounce } from '../utils/debounce';
import { peopleFromServer } from '../data/people';

interface Props {
  onSelected: Dispatch<SetStateAction<string>>
}

export const Autocomplate: React.FC<Props> = ({
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isInputFocused, setIsInputFocused] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const handleQueryClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    const content = event.currentTarget.textContent || '';

    event.preventDefault();

    setQuery(content);
    onSelected(content);
    setIsInputFocused(false);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(
      person => person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    if (e.relatedTarget) {
      return;
    }

    setIsInputFocused(false);
  };

  return (
    <div className={cn(
      'dropdown',
      'is-flex-direction-column',
      'is-align-self-flex-start',
      { 'is-active': isInputFocused },
    )}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setIsInputFocused(true)}
          onBlur={handleBlur}
        />
      </div>

      {filteredPeople.length === 0
        ? (
          <div
            className="
              notification
              is-danger
              is-light
              mt-2
              is-align-self-flex-start
            "
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        ) : (
          <div
            className="dropdown-menu"
            role="menu"
            data-cy="suggestions-list"
          >
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <a
                  key={person.slug}
                  href="."
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={handleQueryClick}
                >
                  <p
                    className={cn({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                  >
                    {person.name}
                  </p>
                </a>
              ))}
            </div>
          </div>
        )}

    </div>
  );
};
