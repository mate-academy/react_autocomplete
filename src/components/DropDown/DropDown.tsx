import React, {
  useState,
  useMemo,
} from 'react';

import debounce from 'lodash.debounce';
import cn from 'classnames';

import { Person } from '../../types/Person';

interface Props {
  people: Person[],
  onSelected?: (user: Person) => void,
  delay: number,
}

const filterPeople = (people: Person[], query: string) => {
  const filterQuery = query.toLowerCase().trim();

  return people.filter(({ name }) => name.toLowerCase().includes(filterQuery));
};

export const DropDown: React.FC<Props> = ({
  people,
  onSelected = () => {},
  delay,
}) => {
  const [userQuery, setUserQuery] = useState('');
  const [serverQuery, setServerQuery] = useState('');

  const [dropDownVisible, setDropDownVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const humansMemorised = useMemo(
    () => filterPeople(people, serverQuery),
    [serverQuery, people],
  );

  const hasDropDown = dropDownVisible
  && userQuery === serverQuery && isFocused;
  const hasNoMatchMess = !humansMemorised.length && hasDropDown;

  const delayedSetQuery = debounce((
    str: string,
  ) => {
    setServerQuery(str);
    setDropDownVisible(true);
  }, delay);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserQuery(event.target.value);
    setDropDownVisible(false);
    delayedSetQuery(event.target.value);
  };

  const handleInputBlur = () => {
    setDropDownVisible(false);
    setIsFocused(false);
    setUserQuery('');
    delayedSetQuery('');
  };

  const handleInputFocus = () => {
    setDropDownVisible(true);
    setIsFocused(true);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={userQuery}
          onChange={handleQueryChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        {hasDropDown && (
          <div className={cn({
            'dropdown-content': humansMemorised.length,
          })}
          >
            {humansMemorised.map((person) => {
              const { name, slug, sex } = person;

              return (
                <a
                  href={`#${slug}`}
                  className="dropdown-item"
                  key={slug}
                  onMouseDown={() => {
                    onSelected(person);
                  }}
                >
                  <p className={cn({
                    'has-text-link': sex === 'm',
                    'has-text-danger': sex === 'f',
                  })}
                  >
                    {name}
                  </p>
                </a>
              );
            })}
          </div>
        )}
        {hasNoMatchMess && (<p>No matching suggestions</p>)}
      </div>
    </div>
  );
};
