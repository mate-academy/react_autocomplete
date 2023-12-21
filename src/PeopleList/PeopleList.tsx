import {
  useCallback, useMemo, useState, useEffect, useRef,
} from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { Person } from '../types/Person';

enum Esc {
  Escape = 'Escape',
}

interface Props {
  people: Person[];
  delay: number;
  onSelected: (person: Person | null) => void;
}

export const PeopleList: React.FC<Props> = ({ people, delay, onSelected }) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [showDrop, setShowDrop] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const applyQuery = useCallback(
    debounce((newQuery: string) => {
      setAppliedQuery(newQuery);
      setUserTyping(false);
    }, delay),
    [setAppliedQuery, delay],
  );

  const filteredPeople = useMemo(() => {
    return people.filter(person => (
      person
        .name
        .toLocaleLowerCase()
        .includes(appliedQuery.toLocaleLowerCase().trim())
    ));
  }, [appliedQuery, people]);

  const handleItemChange = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => {
    event.preventDefault();
    onSelected(person);
    setShowDrop(false);
    setQuery(person.name);

    if (inputRef.current) {
      inputRef.current.blur();
    }
  };

  const handleQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    setUserTyping(true);

    if (!event.target.value) {
      onSelected(null);
    }
  };

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === Esc.Escape) {
        setShowDrop(false);
      }
    }, [],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [handleEscape]);

  const handleOnMouse = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ): void => {
    event.preventDefault();
    event.stopPropagation();
    handleItemChange(event, person);
    setShowDrop(false);
  };

  return (
    <div
      className={classNames(
        'dropdown',
        { 'is-active': showDrop && !userTyping },
      )}
    >
      <div className="dropdown-trigger">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setShowDrop(true)}
          onBlur={() => setShowDrop(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPeople.length
            ? filteredPeople.map(person => (
              <a
                href="/"
                key={person.name}
                className={classNames(
                  'dropdown-item',
                  { 'has-text-danger': person.sex === 'f' },
                  { 'has-text-link': person.sex === 'm' },
                )}
                onMouseDown={(event) => handleOnMouse(event, person)}
              >
                {person.name}
              </a>
            ))
            : (
              <p className="dropdown-item">No matching suggestions</p>
            )}
        </div>
      </div>
    </div>
  );
};
