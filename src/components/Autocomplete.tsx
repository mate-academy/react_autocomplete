import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { useCallback, useMemo, useState } from 'react';
import { Person } from '../types/Person';
import { peopleFromServer } from '../data/people';

type Props = {
  delay?: number;
  onSelect?: (person: Person | null) => void;
};

export const Autocomplete: React.FC<Props> = ({
  delay = 300,
  onSelect = () => {},
}) => {
  const [query, setQuery] = useState<string>('');
  const [appliedQuery, setAppliedQuery] = useState<string>('');
  const [showSugestion, setShowSugestion] = useState<boolean>(false);

  const applyQuery = useCallback(
    (queryInput: string) => debounce(setAppliedQuery, delay)(queryInput),
    [delay],
  );

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter((person: Person) =>
      person.name.toLowerCase().includes(appliedQuery.toLowerCase()),
    );
  }, [appliedQuery]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      applyQuery(event.target.value);
      onSelect(null);
      setShowSugestion(true);
    },
    [applyQuery, onSelect],
  );

  const handleOnFocus = useCallback(() => setShowSugestion(!query), [query]);
  const handleOnBlur = useCallback(() => {
    debounce(setShowSugestion, 200)(false);
    onSelect(null);
    setQuery('');
  }, [onSelect]);

  const onSelectPerson = (person: Person) => {
    setShowSugestion(true);
    setQuery(person.name);
    onSelect(person);
    setShowSugestion(false);
  };

  return (
    <>
      <div className={classNames('dropdown', { ['is-active']: showSugestion })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleInputChange}
            onFocus={handleOnFocus}
            onBlur={handleOnBlur}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map((person, index) => {
              return (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={index + 1}
                  onClick={() => onSelectPerson(person)}
                  style={{ cursor: 'pointer' }}
                >
                  <p
                    className={classNames({
                      ['has-text-link']: person.sex === 'm',
                      ['has-text-danger']: person.sex === 'f',
                    })}
                  >
                    {person.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {filteredPeople.length === 0 && (
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
    </>
  );
};
