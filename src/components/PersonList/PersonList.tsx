import React from 'react';
import cn from 'classnames';
// import debounce from 'lodash.debounce';

import { Person } from '../../types/Person';

type Props = {
  persons: Person[],
  onSelect?: (person: Person | null) => void,
  // delay: number,
  setFocus: (focus: boolean) => void,
  setQuery: (event: React.ChangeEvent<HTMLInputElement> | string) => void,
  // setAppliedQuery: (event: React.ChangeEvent<HTMLInputElement> | string) => void,
};

export const PersonList: React.FC<Props> = (({
  persons,
  onSelect = () => { },
  // delay,
  setFocus,
  // setAppliedQuery,
  setQuery,
}) => {
  // console.log('ren PersonList');

  // const applyQuery = useCallback(
  //   debounce(setAppliedQuery, delay),
  //   [],
  // );

  return (
    <div className="dropdown-item">
      {persons.length === 0 ? (
        <div className="dropdown-item">
          No matching suggestions
        </div>
      ) : (
        persons.map(person => (
          <div
            key={person.slug}
            className={cn('dropdown-item', {
              'has-text-link': person.sex === 'm',
              'has-text-danger': person.sex === 'f',

            })}
            onClick={() => {
              onSelect(person);
              setFocus(false);
              setQuery(person.name);
              // applyQuery(person.name);
            }}
            onKeyDown={() => onSelect(person)}
            role="tab"
            tabIndex={0}
          >
            {`${person.name}`}
          </div>
        ))
      )}
    </div>
  );
});
