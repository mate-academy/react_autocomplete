import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import cn from 'classnames';
import { Person } from '../types/Person';

interface Props {
  people: Person[],
  onSelected?: (value: Person | null) => void,
}

function debounce(callback: (query: string) => void, delay: number) {
  let timerId = 0;

  return (query: string) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      callback(query);
    }, delay);
  };
}

export const Dropdown: React.FC<Props> = ({
  people,
  onSelected = () => {},
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [hasFocus, setHasFocus] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const filteredPeople = useMemo(() => {
    return people.filter(person => {
      return person.name.toLowerCase().includes(appliedQuery.toLowerCase());
    });
  }, [appliedQuery, people]);

  const applyQuery = useCallback((value: string) => setAppliedQuery(value), []);
  const debounceApply = debounce(applyQuery, 500);

  useEffect(() => setIsTyping(false), [appliedQuery]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    setQuery(event.target.value);
    setIsTyping(true);
    onSelected(null);
    debounceApply(newQuery);

    if (newQuery === appliedQuery) {
      setIsTyping(false);

      return;
    }

    setIsTyping(true);
  };

  const handleDropdownSelect = (person: Person) => {
    onSelected(person);
    setQuery(person.name);
    setAppliedQuery(person.name);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setHasFocus(false);
    }, 300);
  };

  return (
    <div className={cn('dropdown', {
      'is-active': hasFocus && !isTyping,
    })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onFocus={() => setHasFocus(true)}
          onBlur={handleBlur}
          onChange={(e) => handleChange(e)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {
            filteredPeople.length > 0
              ? filteredPeople.map((person, i) => (
                <div
                  className="dropdown-item"
                  key={person.slug}
                  onClick={() => handleDropdownSelect(person)}
                  onKeyDown={() => handleDropdownSelect(person)}
                  tabIndex={i}
                  role="button"
                  style={{ cursor: 'pointer' }}
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              ))
              : (
                <div className="dropdown-item">
                  <p className="has-text-danger">
                    No matching suggestions
                  </p>
                </div>
              )
          }
        </div>
      </div>
    </div>
  );
};
