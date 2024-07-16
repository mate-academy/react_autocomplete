import React, { useState } from 'react';
import cn from 'classnames';
import './Autocomplete.scss';
import { Person } from '../../types/Person';

type Props = {
  peoples: Person[],
  query: string,
  onQuery: (value: string) => void,
  onApplyQuery: (value: string) => void,
  onSelected: (value: Person | null) => void,
}

export const Autocomplete: React.FC<Props> = ({
  peoples,
  query,
  onQuery,
  onApplyQuery,
  onSelected,
}) => {
  const [focus, setFocus] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onQuery(e.target.value);
    onApplyQuery(e.target.value);
    onSelected(null);
  }

  const handleMouseDown = (people: Person) => {
    onSelected(people);
    onQuery(people.name);
  }

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          data-cy="search-input"
        />
      </div>

      {focus && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">

          <div className="dropdown-content">
            {peoples.map(people => {
              const genderType = people.sex === 'm' ? 'has-text-link' : 'has-text-danger';

              return (
                <div
                  key={people.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onMouseDown={() => handleMouseDown(people)}
                >
                  <p className={cn(genderType)}>
                    {people.name}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  );
}
