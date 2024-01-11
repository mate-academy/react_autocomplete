import { useCallback, useMemo, useState } from 'react';
import { Person } from './types/Person';
import { peopleFromServer } from './data/people';

export function debounce(callback: (...args: string[]) => void, delay: number) {
  let timerId = 0;

  return (...args: string[]) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

type Props = {
  delay: number;
  onSelected: (person: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = ({ delay, onSelected }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [suggestionsList, setSuggestionsList] = useState<Person[]>([]);
  const [dropdownActive, setDropdownActive] = useState(false);
  /* eslint-disable-next-line */
  const suggestList = useCallback(
    debounce((value: string) => {
      setAppliedQuery(value);
      if (!value.trim()) {
        setSuggestionsList(peopleFromServer);
      } else {
        setSuggestionsList((prevSuggestions) => prevSuggestions
          .filter((person) => person.name.toLowerCase()
            .includes(value.toLowerCase())));
      }

      setDropdownActive(true);
    }, delay), [delay, setAppliedQuery, setSuggestionsList],
  );

  const filteredInputs = useMemo(() => {
    return suggestionsList.filter(
      person => person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery, suggestionsList]);

  const handleInputBlur = () => {
    setTimeout(() => {
      setDropdownActive(false);
    }, 200);
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setDropdownActive(false);
    suggestList(event.target.value);
  };

  const handlePersonSelect = (selectedPerson: Person) => {
    setQuery(selectedPerson.name);
    onSelected(selectedPerson);
    setDropdownActive(false);
  };

  return (
    <div className={`dropdown ${dropdownActive ? 'is-active' : ''}`}>
      <div className="dropdown-trigger">
        <label htmlFor="people-list"> </label>
        <input
          id="people-list"
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onClick={() => {
            setSuggestionsList(peopleFromServer);
          }}
          onFocus={() => {
            setDropdownActive(true);
          }}
          onBlur={handleInputBlur}
        />
      </div>
      {dropdownActive && suggestionsList.length > 0 && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {query && !filteredInputs ? (
              <div className="dropdown-item">No matching suggestions</div>
            ) : (
              filteredInputs.map((person) => (
                <div
                  role="button"
                  tabIndex={0}
                  className="dropdown-item"
                  key={person.name}
                  onClick={() => handlePersonSelect(person)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handlePersonSelect(person);
                    }
                  }}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              )))}
          </div>
        </div>
      )}
    </div>
  );
};
