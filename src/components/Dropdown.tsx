import React, {
  useCallback,
  useMemo,
  useState,
  useRef,
  useEffect,
} from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { Person } from '../types/Person';

interface Props {
  people: Person[];
  delay: number;
  onSelected?: (user: Person) => void,
}

export const Dropdown: React.FC<Props> = React.memo(({
  people,
  onSelected = () => {},
  delay,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [hasFocus, setHasFocus] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value.trimStart());
    applyQuery(event.target.value);
    if (query) {
      setIsProcessing(true);
    }
  };

  const searchField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchField.current) {
      searchField.current.focus();
    }
  }, []);

  const filteredPeople = useMemo(() => {
    setIsProcessing(false);

    return people.filter(
      // eslint-disable-next-line max-len
      person => person.name.toLowerCase().includes(appliedQuery.trim().toLowerCase()),
    );
  }, [people, appliedQuery]);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => {
    event.preventDefault();
    setQuery(person.name);
    onSelected(person);
    setHasFocus(false);
  };

  return (
    <div className={classNames('dropdown', {
      'is-active': hasFocus,
    })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          ref={searchField}
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content has-text-link">
          {!isProcessing
            ? (
              filteredPeople.map(person => (
                <a
                  className="dropdown-item"
                  href="/"
                  key={person.slug}
                  onMouseDown={(event) => handleMouseDown(event, person)}
                >
                  <p
                    className={classNames({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                  >
                    {person.name}
                  </p>
                </a>
              ))
            )
            : (
              <div className="p-2 notification is-info has-text-ligth">
                Processing
              </div>
            )}

          {(!filteredPeople.length && !isProcessing) && (
            <div className="p-2 notification is-warning has-text-danger-dark">
              <p>No matching suggestions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
