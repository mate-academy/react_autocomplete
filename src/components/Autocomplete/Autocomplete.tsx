import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import debounce from 'lodash.debounce';
import cn from 'classnames';
import { Person } from '../../types/Person';
import { getFilteredPeople } from '../../utils/getFilteredPeople';
import { SuggestionList } from '../SuggestionList';
import { NoSuggestionsMessage } from '../NoSuggestionsMessage';

type Props = {
  people: Person[];
  onSelectedPerson: (person: Person | null) => void;
  selectedPerson: Person | null;
  delay?: number;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelectedPerson,
  selectedPerson,
  delay = 300,
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const wrapperDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedPerson) {
      setQuery(selectedPerson.name);
      setAppliedQuery(selectedPerson.name.toLowerCase());
    } else {
      setQuery('');
      setAppliedQuery('');
    }
  }, [selectedPerson]);

  const applyQuery = useMemo(() => debounce(setAppliedQuery, delay), [delay]);

  useEffect(() => {
    return () => {
      applyQuery.cancel();
    };
  }, [applyQuery]);

  const clearPersonSelection = useCallback(() => {
    onSelectedPerson(null);
    setAppliedQuery('');
  }, [onSelectedPerson]);

  const onQueryChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value.trim().toLowerCase();

      setQuery(event.target.value);
      setIsFocused(true);

      if (selectedPerson) {
        clearPersonSelection();
      }

      if (value === '') {
        applyQuery.cancel();
        setQuery('');
      } else {
        applyQuery(value);
      }
    },
    [selectedPerson, clearPersonSelection, applyQuery],
  );

  const filteredPeople = useMemo(() => {
    return getFilteredPeople(people, { query: appliedQuery });
  }, [appliedQuery, people]);

  const onFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const onClickPersonSelected = useCallback(
    (person: Person) => {
      onSelectedPerson(person);

      setIsFocused(false);
      setQuery(person.name);
      setAppliedQuery(person.name.toLowerCase());
    },
    [onSelectedPerson],
  );

  const onClickOutside = useCallback((event: MouseEvent) => {
    if (
      wrapperDropdownRef.current &&
      !wrapperDropdownRef.current.contains(event.target as Node)
    ) {
      setIsFocused(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', onClickOutside);

    return () => {
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [onClickOutside]);

  return (
    <>
      <div
        className={cn('dropdown', {
          'is-active': isFocused && filteredPeople.length > 0,
        })}
        ref={wrapperDropdownRef}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={onQueryChange}
            onFocus={onFocus}
          />
        </div>

        {isFocused && filteredPeople.length > 0 && (
          <SuggestionList
            people={filteredPeople}
            onSelectPerson={onClickPersonSelected}
          />
        )}
      </div>
      {isFocused && appliedQuery && filteredPeople.length === 0 && (
        <NoSuggestionsMessage />
      )}
    </>
  );
};
