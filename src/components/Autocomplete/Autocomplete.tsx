import React, {
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import { debounce } from 'lodash';
import clsx from 'clsx';
import { Person } from '../../types/Person';
import './Autocomplete.scss';

type Props = {
  people: Person[];
  delay?: number;
};

export const Autocomplete: React.FC<Props> = ({ people, delay }) => {
  const [hoveredPerson, setHoveredPerson] = useState<Person | null>(null);

  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [title, setTitle] = useState('No selected person');
  const [loading, setLoading] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredPeople = useMemo(() => {
    return people
      .filter(person => person?.name?.toLowerCase()
        .includes(appliedQuery.toLowerCase()));
  }, [appliedQuery, people]);

  const delayQuery = useMemo(() => debounce((value: string) => {
    setAppliedQuery(value.trim());
  }, delay), [delay]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.trim();

      setQuery(value);
      setTitle('No selected person');
      setLoading(true);
      delayQuery(value);
    }, [delayQuery],
  );

  const handleOnBlur = useCallback(() => {
    setTimeout(() => {
      if (dropdownRef.current
        && !dropdownRef.current.contains(document.activeElement as Node)) {
        setIsVisible(false);
        setLoading(false);
      }
    }, 100);
  }, []);

  const handlePersonSelect = useCallback((person: Person | null) => {
    if (person) {
      setQuery(person.name);
      setTitle(`${person.name} (${person.born} - ${person.died})`);
    } else {
      setQuery('');
      setTitle('No selected person');
    }

    setIsVisible(false);
    setLoading(false);
  }, []);

  useEffect(() => {
    return () => {
      delayQuery.cancel();
    };
  }, [delayQuery]);

  useEffect(() => {
    const fetchData = () => {
      setAppliedQuery(query);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, [query]);

  return (
    <>
      <h1 className="title" data-cy="title">
        {title}
      </h1>

      <div className="dropdown is-active" ref={dropdownRef}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsVisible(true)}
            onBlur={handleOnBlur}
          />
        </div>

        {isVisible && !loading && (
          <ul
            className="dropdown-menu"
            role="menu"
            data-cy="suggestions-list"
          >
            <div className="dropdown-content">
              {!filteredPeople.length ? (
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
              ) : (
                filteredPeople.map((person) => (
                  <div
                    key={person.slug}
                    className={clsx('dropdown-item', {
                      hovered: hoveredPerson === person,
                    })}
                    data-cy="suggestion-item"
                    role="button"
                    tabIndex={0}
                    onClick={() => handlePersonSelect(person)}
                    onMouseEnter={() => setHoveredPerson(person)}
                    onMouseLeave={() => setHoveredPerson(null)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        handlePersonSelect(person);
                      }
                    }}
                  >
                    <p className="has-text-link">{person.name}</p>
                  </div>
                ))
              )}
            </div>
          </ul>
        )}
      </div>
    </>
  );
};
