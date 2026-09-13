import React from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  delay?: number;
  onSelected: (person: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  delay = 300,
  onSelected,
}) => {
  const [query, setQuery] = React.useState('');
  const [appliedQuery, setAppliedQuery] = React.useState('');
  const [isOpen, setIsOpen] = React.useState(false);

  const applyQuery = React.useMemo(() => debounce(setAppliedQuery, delay), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);
    onSelected(null);
    applyQuery(value.trim());
  };

  const handleFocus = () => {
    setIsOpen(true);
    if (!query) {
      setAppliedQuery('');
    }
  };

  const suggestedPeople = React.useMemo(
    () =>
      people.filter(person =>
        person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
      ),
    [people, appliedQuery],
  );

  const showNoSuggestions =
    isOpen && appliedQuery !== '' && suggestedPeople.length === 0;

  return (
    <>
      <div className={'dropdown' + (isOpen ? ' is-active' : '')}>
        <div className="dropdown-trigger">
          <input
            value={query}
            onChange={handleQueryChange}
            onFocus={handleFocus}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
          />
        </div>

        {isOpen && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {suggestedPeople.map(person => (
                <div
                  key={person.slug}
                  onClick={() => {
                    onSelected(person);
                    setIsOpen(false);
                    setQuery(person.name);
                  }}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showNoSuggestions && (
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
    </>
  );
};
