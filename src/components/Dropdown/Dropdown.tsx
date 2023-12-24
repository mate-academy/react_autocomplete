import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import './Dropdown.scss';
import classNames from 'classnames';
import { Person } from '../../types/Person';

interface Props {
  people: Person[]
  setPerson: (currentPerson: Person) => void
  delay: number
}

// eslint-disable-next-line @typescript-eslint/ban-types
function debounce(callback: Function, delay: number) {
  let timerId = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

export const Dropdown: React.FC<Props> = React.memo(({
  people,
  setPerson,
  delay,
}) => {
  const [peopleList, setPeopleList] = useState(people);
  const [focusedItem, setFocusedItem] = useState<string | null>(null);
  const [isMenuShown, setIsMenuShown] = useState(false);
  const [query, setQuery] = useState('');
  const [queryAplied, setQueryAplied] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(debounce(setQueryAplied, delay), [delay]);

  useEffect(() => {
    setPeopleList(() => people.filter((person) => person
      .name
      .toLowerCase()
      .includes(queryAplied.toLowerCase())));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryAplied]);

  useEffect(() => {
    applyQuery(query);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleClickOutside = (event: MouseEvent) => {
    if (!dropdownRef.current?.contains(event.target as Node)) {
      setIsMenuShown(false);
      document.removeEventListener('mousedown', handleClickOutside);
    }
  };

  const handleFocus = (slug: string) => {
    setFocusedItem(slug);
  };

  const handleBlur = () => {
    setFocusedItem(null);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
  };

  const handleInputClick = () => {
    document.removeEventListener('mousedown', handleClickOutside);
    document.addEventListener('mousedown', handleClickOutside);
  };

  const handlePersonClick = (person: Person) => {
    const { name } = person;

    setQuery(name);
    document.removeEventListener('mousedown', handleClickOutside);
    setIsMenuShown(false);
    setPerson(person);
    setFocusedItem(null);
  };

  return (
    <div className="dropdown is-active" ref={dropdownRef}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          onChange={handleInputChange}
          value={query}
          onClick={handleInputClick}
          onFocus={() => setIsMenuShown(true)}
        />
      </div>

      {
        isMenuShown && (
          <div className="dropdown-menu box" role="menu">
            <div className="dropdown-content">
              {
                peopleList.length
                  ? (peopleList.map((person) => {
                    const { name, slug } = person;

                    return (
                      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                      <div
                        key={slug}
                        className="dropdown-item dropdown-item__custom"
                        onMouseEnter={() => handleFocus(slug)}
                        onMouseLeave={handleBlur}
                        onClick={() => handlePersonClick(person)}
                      >
                        <p
                          className={classNames({
                            'has-text-link': focusedItem !== slug,
                            'has-text-danger': focusedItem === slug,
                          })}
                        >
                          {name}
                        </p>
                      </div>
                    );
                  }))
                  : (
                    <h1 className="dropdown-item">No matching suggestions</h1>
                  )
              }
            </div>
          </div>
        )
      }
    </div>
  );
});
