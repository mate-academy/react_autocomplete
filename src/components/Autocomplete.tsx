import React, {
  useState,
  useEffect,
  KeyboardEvent,
} from 'react';
import debounce from 'lodash/debounce';
import { Person } from '../types/Person';

interface Props {
  people: Person[];
  delay: number;
  onSelected: (person: Person | null) => void;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  delay,
  onSelected,
}) => {
  const [inputText, setInputText] = useState('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const delayedFilter = debounce((text: string) => {
    const filtered = people.filter(
      (person) => person.name.toLowerCase().includes(text.toLowerCase())
        || person.slug.toLowerCase().includes(text.toLowerCase()),
    );

    setFilteredPeople(filtered);
    setShowSuggestions(true);
  }, delay);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;

    setInputText(newText);
    if (newText === '') {
      setShowSuggestions(false);
      setFilteredPeople([]);
      onSelected(null);
    } else {
      setShowSuggestions(true);
      delayedFilter(newText.trim());
    }
  };

  const handleSuggestionClick = (person: Person) => {
    setInputText(person.name);
    setShowSuggestions(false);
    onSelected(person);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, person: Person) => {
    if (e.key === 'Enter') {
      handleSuggestionClick(person);
    }
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
    if (inputText.trim() !== ''
     || inputText.trim() === '') {
      delayedFilter(inputText.trim());
    }
  };

  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const relatedTarget = event.relatedTarget as HTMLElement;

    if (relatedTarget && relatedTarget.closest('.dropdown-content')) {
      return;
    }

    setShowSuggestions(false);
  };

  useEffect(() => {
    if (!showSuggestions) {
      setFilteredPeople([]);
    }
  }, [showSuggestions]);

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={inputText}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </div>

      {showSuggestions && (
        <div className="dropdown-menu" role="menu">
          <ul className="dropdown-content">
            {filteredPeople.length === 0 ? (
              <div className="dropdown-item">
                <p className="has-text-danger">No matching suggestions</p>
              </div>
            ) : (
              filteredPeople.map((person) => (
                <div
                  className="dropdown-item"
                  role="button"
                  key={person.slug}
                  onClick={() => handleSuggestionClick(person)}
                  onKeyDown={(e) => handleKeyDown(e, person)}
                  tabIndex={0}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
