import classnames from 'classnames';
import { useState, useCallback, useMemo } from 'react';
import debounce from 'lodash.debounce';

import { Person } from '../../types/Person';

type Props = {
  query: string;
  people: Person[];
  onSelected: (person: Person) => void;
  onChange: (value: string) => void;
  delay: number;
};

export const Dropdown: React.FC<Props> = ({
  query,
  people,
  onSelected,
  onChange,
  delay,
}) => {
  const [visiblePeople, setVisiblePeople] = useState(false);
  const [preparedQuery, setPreparedQuery] = useState('');

  const prepareQuery = useCallback(debounce(setPreparedQuery, delay), []);

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);

    prepareQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    return people.filter(human => {
      return human.name.toLowerCase().includes(preparedQuery.toLowerCase());
    });
  }, [people, preparedQuery]);

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={inputHandler}
          onClick={() => setVisiblePeople(true)}
          onBlur={() => setVisiblePeople(false)}
        />
      </div>

      {visiblePeople && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople
              ? filteredPeople.map(person => (
                <div className="dropdown-item" key={person.slug}>
                  <a
                    href={person.slug}
                    className={classnames(
                      'has-text-link',
                      {
                        'has-text-link': person.sex === 'm',
                        'has-text-danger': person.sex === 'f',
                      },
                    )}
                    onMouseDown={() => onSelected(person)}
                  >
                    {person.name}
                  </a>
                </div>
              )) : (
                <div className="dropdown-item has-text-link">
                  No matching suggestions
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
};
