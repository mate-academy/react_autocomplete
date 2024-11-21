import { useCallback, useMemo, useState } from 'react';
import { peopleFromServer } from '../data/people';
import { Person } from '../types/Person';
import debounce from 'lodash.debounce';

type Props = {
  onSelected: (person: Person | null) => void;
  delay?: number;
};

export const AutoComplete: React.FC<Props> = ({ onSelected, delay }) => {
  const [input, setInput] = useState('');
  const [showAll, setShowAll] = useState(false);

  const query = useCallback(() => {
    setShowAll(true);
  }, []);

  const debounceQuery = debounce(query, delay);

  const filteredPerson = useMemo(() => {
    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(input.toLowerCase()),
    );
  }, [input]);

  const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debounceQuery();
    setInput(event.target.value);
    setShowAll(false);
    onSelected(null);
  };

  const inputFocus = () => {
    if (!input) {
      setShowAll(true);
    }
  };

  const inputBlur = () => {
    setTimeout(() => {
      setShowAll(false);
    }, 300);
  };

  const suggestionClick = (selectedPerson: Person) => {
    setInput(selectedPerson.name);
    setShowAll(false);
    onSelected(selectedPerson);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={input}
          onChange={inputChange}
          onFocus={inputFocus}
          onBlur={inputBlur}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        {showAll && (
          <div className="dropdown-content">
            {filteredPerson.length ? (
              filteredPerson.map((currentPeople: Person) => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={currentPeople.name}
                  onClick={() => suggestionClick(currentPeople)}
                >
                  <p className="has-text-link">{currentPeople.name}</p>
                </div>
              ))
            ) : (
              <div
                className={
                  'notification ' +
                  'is-danger ' +
                  'is-light ' +
                  'mt-3 ' +
                  'is-align-self-flex-start'
                }
                role="alert"
                data-cy="no-suggestions-message"
              >
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
