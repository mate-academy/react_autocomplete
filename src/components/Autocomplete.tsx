import { useCallback, useState } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { Person } from '../types/Person';

interface Props {
  filteredList: Person[],
  query: string,
  setQuery: (query: string) => void,
  setAppliedQuery: (query: string) => void,
  setSelectedPerson: (person: Person) => void,
}

export const Autocomplete: React.FC<Props> = ({
  filteredList,
  query,
  setQuery,
  setAppliedQuery,
  setSelectedPerson,
}) => {
  const [hasFocus, setHasFocus] = useState(false);

  // eslint-disable-next-line
  const applyQuery = useCallback(
    debounce(setAppliedQuery, 1000),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleMouseDown = (person: Person) => {
    setQuery(person.name);
    setAppliedQuery('');
    setSelectedPerson(person);
  };

  return (
    <div className={classNames('dropdown dropdown-with-cross', {
      'is-active': hasFocus,
    })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          className="input"
          placeholder="Enter a part of the name"
          value={query}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
          onChange={handleQueryChange}
        />
      </div>

      {hasFocus && (
        <div className="dropdown-menu" role="menu">
          <div
            className="dropdown-content"
            style={{ maxHeight: '300px', overflowY: 'auto' }}
          >
            {filteredList[0] ? filteredList.map(person => (
              <a
                href="/#"
                key={person.slug}
                className="dropdown-item"
                onMouseDown={() => handleMouseDown(person)}
              >
                <p className="has-text-link">{person.name}</p>
              </a>
            )) : <p className="dropdown-item">No matching suggestions</p>}
          </div>
        </div>
      )}
    </div>
  );
};
