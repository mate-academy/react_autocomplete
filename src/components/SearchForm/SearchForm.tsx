import {
  useCallback,
  useMemo,
  useState,
  useEffect,
} from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';

interface Props {
  people: Person[];
  delay: number;
  onSelected: (person: Person | null) => void;
}

export const SearchForm: React.FC<Props> = ({
  people,
  delay,
  onSelected,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [showDrop, setShowDrop] = useState(false);

  const applyQuery = useCallback(debounce((newQuery: string) => {
    setAppliedQuery(newQuery);
  }, delay), []);

  const filteredPeople = useMemo(() => {
    const preparedAppliedQuery = appliedQuery.toLowerCase().trim();

    return people.filter(person => (
      person.name.toLowerCase().includes(preparedAppliedQuery)
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
  };

  const handleQueryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);

    if (event.target.value === '') {
      onSelected(null);
    }
  };

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
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

  return (
    <div
      className={classNames(
        'dropdown',
        { 'is-active': showDrop },
      )}
    >
      <div className="dropdown-trigger">
        <input
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
                onMouseDown={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  handleItemChange(event, person);
                  setShowDrop(false);
                }}
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
