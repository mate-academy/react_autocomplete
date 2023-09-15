import { useState, useCallback, useMemo } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';
import './Autocomplete.scss';

const SEX_MALE = 'm';
const SEX_FEMALE = 'f';
const SEARCH_DELAY = 1000;

type Props = {
  people: Person[];
  delayInSeconds?: number;
  onSelected?: (peson: Person | null) => void,
};

export const Autocomplete: React.FC<Props> = ({
  people,
  delayInSeconds = 1,
  onSelected = () => {},
}) => {
  const [inputValue, setInputValue] = useState('');
  const [lookupQuery, setLookupQuery] = useState('');
  const [isListOpened, setIsListOpened] = useState(false);

  const openList = () => setIsListOpened(true);
  const closeList = () => setIsListOpened(false);

  const showSuggestions = (query: string) => {
    setLookupQuery(query);
    openList();
  };

  const showSuggestionsAfterDelay = useCallback(
    debounce(showSuggestions, delayInSeconds * SEARCH_DELAY),
    [delayInSeconds],
  );

  const handleInputValueChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    closeList();
    setInputValue(event.target.value);
    showSuggestionsAfterDelay(event.target.value);
  };

  const handleSuggestionClick = (person: Person) => {
    setInputValue(person.name);
    setLookupQuery(person.name);
    onSelected(person);
    closeList();
  };

  const suggestedPeople = useMemo(() => {
    const query = lookupQuery.trim().toLowerCase();

    return people.filter(
      ({ name }) => name.toLowerCase().includes(query),
    );
  }, [people, lookupQuery]);

  return (
    <div
      className={classNames('dropdown', {
        'is-active': isListOpened,
      })}
    >
      <div className="dropdown-trigger">
        <input
          value={inputValue}
          onChange={handleInputValueChange}
          onFocus={openList}
          onBlur={() => setTimeout(closeList, 200)}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {suggestedPeople.length ? (
            suggestedPeople.map(person => (
              <button
                key={person.slug}
                type="button"
                className={classNames('dropdown-item', 'button', 'suggestion', {
                  'has-text-link': person.sex === SEX_MALE,
                  'has-text-danger': person.sex === SEX_FEMALE,
                })}
                onClick={() => handleSuggestionClick(person)}
              >
                {person.name}
              </button>
            ))
          ) : (
            <div className="dropdown-item">
              <p>No matching suggestions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
