import React, { useState, useMemo, useCallback } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { peopleFromServer } from '../../data/people';
import { Person } from '../../types/Person';

type Props = {
  onSelectPerson: (pers: Person | null) => void,
  delay: number,
};

export const Autocomplete: React.FC<Props> = ({
  onSelectPerson,
  delay,
}) => {
  const [isActive, setIsActive] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');
  const [qwery, setQwery] = useState('');

  const applyQuery = useCallback(debounce((str: string) => {
    setAppliedQuery(str);
    setIsActive(true);
  }, delay), []);

  const handleQweryChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setQwery(event.target.value);
    applyQuery(event.target.value);
    onSelectPerson(null);
  };

  const filteredPeople = useMemo(() => {
    const people = [...peopleFromServer];
    const qweryForFilter = appliedQuery.trim().toLowerCase();

    return people
      .filter(({ name }) => name.toLowerCase().includes(qweryForFilter));
  }, [appliedQuery]);

  return (
    <div className={classNames('dropdown', { 'is-active': isActive })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={qwery}
          onBlur={() => setIsActive(false)}
          onChange={handleQweryChange}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {!filteredPeople.length ? (
            <div className="dropdown-item">No matching suggestions</div>
          ) : (
            filteredPeople.map(pers => (
              <a
                className="dropdown-item"
                href="/"
                key={pers.slug}
                onMouseDown={() => {
                  setQwery(pers.name);
                  onSelectPerson(pers);
                }}
              >
                <p
                  className={classNames({
                    'has-text-link': pers.sex === 'm',
                    'has-text-danger': pers.sex === 'f',
                  })}
                >
                  {pers.name}
                </p>
              </a>
            )))}
        </div>
      </div>
    </div>
  );
};
