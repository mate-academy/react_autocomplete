import React, { useCallback, useState } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  filteredList: Person[];
  query: string
  setQuery: (query: string) => void,
  setAppliedQuery: (query: string) => void,
  onSelected: (human: Person) => void,
  timer?: number,
};

export const Autocomplete: React.FC<Props> = ({
  filteredList,
  query,
  setQuery,
  setAppliedQuery,
  onSelected,
  timer = 1000,
}) => {
  const [hasFocus, setHasFocus] = useState(false);
  /* eslint-disable-next-line */
  const applyQuery = useCallback(debounce(setAppliedQuery, timer), [timer]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleHumanSet = (human: Person) => {
    onSelected(human);
    setQuery('');
    setAppliedQuery('');
  };

  return (
    <div className={classNames('dropdown', {
      'is-active': hasFocus,
    })}
    >
      <div className="dropdown-trigger">
        <input
          value={query}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
          onChange={handleQueryChange}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
        />
      </div>

      {hasFocus && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredList[0] ? filteredList.map(human => (
              <a
                href="/#"
                key={human.name}
                className="dropdown-item"
                onMouseDown={() => handleHumanSet(human)}
              >
                <p className="has-text-link">{human.name}</p>
              </a>
            )) : <p className="has-text-link">No matching suggestions</p>}
          </div>
        </div>
      )}
    </div>
  );
};
