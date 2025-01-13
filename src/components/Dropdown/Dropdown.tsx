import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';
import debounce from 'lodash.debounce';

import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  delay?: number;
  onSelect?: (person: Person | null) => void;
};

export const Dropdown: React.FC<Props> = ({
  people,
  delay = 300,
  onSelect = () => {},
}) => {
  const [text, setText] = useState('');
  const [hasFocus, setHasFocus] = useState(false);

  const [appliedText, setAppliedText] = useState('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyText = useCallback(debounce(setAppliedText, delay), []);

  const filteredPeople = useMemo(() => {
    return people.filter(person =>
      person.name.toLowerCase().includes(appliedText.toLowerCase()),
    );
  }, [people, appliedText]);

  const dropdown = useRef<HTMLDivElement>(null);

  const handleGlobalClick = (event: MouseEvent) => {
    if (dropdown.current && !dropdown.current.contains(event.target as Node)) {
      setHasFocus(false);
    }
  };

  useEffect(() => {
    if (hasFocus) {
      document.addEventListener('click', handleGlobalClick);
    } else {
      document.removeEventListener('click', handleGlobalClick);
    }

    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [hasFocus]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    onSelect(null); // reset selectedPerson after first change
    setText(newValue);
    applyText(newValue.trim());
  };

  const handleSelect = (person: Person) => {
    onSelect(person);
    setText(person.name);
    setAppliedText(person.name);

    setHasFocus(false);
  };

  return (
    <div
      className={classNames('dropdown', { 'is-active': hasFocus })}
      ref={dropdown}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={text}
          onChange={handleInputChange}
          onFocus={() => setHasFocus(true)}
        />
      </div>

      <div
        className="dropdown-menu"
        role="menu"
        data-cy="suggestions-list"
        style={{ maxHeight: '200px', overflowX: 'auto' }}
      >
        {filteredPeople.length !== 0 ? (
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <a
                key={person.name}
                className="dropdown-item"
                data-cy="suggestion-item"
                onClick={() => handleSelect(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </a>
            ))}
          </div>
        ) : (
          <div
            className="notification
                    is-danger
                    is-light
                    mt-3
                    is-align-self-flex-start"
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
