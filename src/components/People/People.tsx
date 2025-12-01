import { FC, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Person } from '../../types/Person';
import { debounce } from '../utils';
import s from './People.module.scss';

interface Props {
  people: Person[];
  selectedPerson: Person | null;
  onSelected: (person: Person | null) => void;
  delay: number;
}

export const People: FC<Props> = ({
  people,
  selectedPerson,
  onSelected,
  delay = 300,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredPeople, setFilteredPeople] = useState<Person[]>(people);
  const [query, setQuery] = useState('');

  const containerRef = useRef<HTMLDivElement | null>(null);

  const debouncedFilter = useRef(
    debounce((value: string) => {
      const trimmed = value.trim();

      if (trimmed === '') {
        setFilteredPeople([]);

        return;
      }

      const lower = trimmed.toLowerCase();

      const filtered = people.filter(p => p.name.toLowerCase().includes(lower));

      setFilteredPeople(filtered);
    }, delay),
  ).current;

  useEffect(() => {
    if (selectedPerson) {
      setQuery(selectedPerson.name);
    }
  }, [selectedPerson]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (selectedPerson) {
      onSelected(null);
    }

    setQuery(value);
    debouncedFilter(value);
  };

  const handleSelect = (person: Person) => {
    onSelected(person);
    setIsOpen(false);
  };

  const handleToggle = () => {
    setIsOpen(prev => {
      const next = !prev;

      if (next) {
        setFilteredPeople(people);
      }

      return next;
    });
  };

  return (
    <div>
      <div
        className={cn('dropdown', { 'is-active': isOpen })}
        ref={containerRef}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            onFocus={handleToggle}
            value={query}
            onChange={handleChange}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map(person => (
              <div
                key={person.slug}
                className={`dropdown-item ${s.dropdownItem}`}
                data-cy="suggestion-item"
                onClick={() => handleSelect(person)}
              >
                <p
                  className={
                    person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                  }
                >
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {!filteredPeople.length && (
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
      )}
    </div>
  );
};
