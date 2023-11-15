import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

interface Props {
  people: Person[],
  timer?: number,
  onSelect?: (person: Person | null) => void,
}

export const Autocomplete: React.FC<Props> = ({
  people,
  timer = 1000,
  onSelect = () => { },
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const applyQuery = useCallback(
    debounce(setAppliedQuery, timer),
    [timer],
  );

  const filteredPeople = useMemo(() => {
    return people.filter(p => {
      return p.name.toLowerCase().includes(appliedQuery.toLowerCase());
    });
  }, [people, appliedQuery]);

  const handlePersonSelect = (person: Person | null) => {
    onSelect(person);

    if (person) {
      setQuery(person.name);
    }
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;

    setIsFocused(false);
    setQuery(inputValue);
    applyQuery(inputValue);
    setTimeout(() => {
      setIsFocused(true);
    }, timer);
    if (inputValue.length === 0) {
      handlePersonSelect(null);
    }
  };

  const handleOnBlur = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (query || appliedQuery) {
      setQuery('');
      applyQuery('');
      setAppliedQuery(event.target.value);
      setTimeout(() => {
        setIsFocused(false);
      });
    } else {
      setTimeout(() => {
        setIsFocused(false);
      });
    }
  };

  return (
    <div className={classNames('dropdown', {
      'is-active': isFocused,
    })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onFocus={() => setIsFocused(true)}
          onBlur={handleOnBlur}
          onChange={handleQueryChange}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filteredPeople.length
            ? filteredPeople.map(person => {
              const isWoman = person.sex === 'f';
              const { name } = person;

              return (
                <a
                  href="/#"
                  className="dropdown-item"
                  key={person.name}
                  onMouseDown={() => handlePersonSelect(person)}
                >
                  <p className={classNames(
                    isWoman
                      ? 'has-text-danger'
                      : 'has-text-link',
                  )}
                  >
                    {name}
                  </p>
                </a>
              );
            })
            : (
              <div className="dropdown-item">
                <p>No matching suggestions</p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
