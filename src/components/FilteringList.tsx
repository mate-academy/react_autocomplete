import { FC, memo } from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  list: Person[];
  setSelectPerson: (selectPerson: Person) => void;
  setApplyQuery: (applyQuery: string) => void;
};

export const FilteringList:FC<Props> = memo(({
  list,
  setSelectPerson,
  setApplyQuery,
}) => {
  const clickHandler = (person: Person) => {
    setSelectPerson(person);
    setApplyQuery('');
  };

  return (
    <>
      {list.length === 0 ? (
        <div className="dropdown-menu">
          No matching suggestions
        </div>
      ) : (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {list.map(person => (
              <div className="dropdown-item">
                <p
                  className={classNames(
                    'suggestion-link',
                    'has-text-link',
                    { 'has-text-danger': person.sex === 'f' },
                  )}
                  onClick={() => {
                    clickHandler(person);
                  }}
                  onKeyDown={() => {
                    clickHandler(person);
                  }}
                  role="presentation"
                >
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    </>
  );
});
