import classnames from 'classnames';
import { useState } from 'react';
import debounce from 'lodash.debounce';

import { Person } from '../../types/Person';
import { useFilteredPeople } from '../../utils/utils';
import { FEMALE_SEX, MALE_SEX } from '../../variables/variables';

type Props = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  searchDelay: number;
};

export const Dropdown: React.FC<Props> = ({
  people,
  onSelected,
  searchDelay,
}) => {
  const [visiblePeople, setVisiblePeople] = useState(false);
  const [preparedQuery, setPreparedQuery] = useState('');
  const [query, setQuery] = useState('');

  const prepareQuery = debounce(setPreparedQuery, searchDelay);

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    prepareQuery(event.target.value);
  };

  const filteredPeople = useFilteredPeople(people, preparedQuery);

  const resetSelectedPerson = () => {
    setQuery('');
    setPreparedQuery('');
    onSelected(null);
  };

  const handleSelect = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => {
    event.preventDefault();

    setQuery(person.name);
    onSelected(person);
    setVisiblePeople(false);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <div className="control has-icons-right">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={inputHandler}
            onFocus={() => setVisiblePeople(true)}
          />

          {query && (
            <span className="icon is-right">
              <button
                type="button"
                className="delete"
                aria-label="close"
                onClick={resetSelectedPerson}
              />
            </span>
          )}
        </div>
      </div>

      {visiblePeople && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {filteredPeople.length
              ? filteredPeople.map(person => (
                <div className="dropdown-item" key={person.slug}>
                  <a
                    href={person.slug}
                    className={classnames(
                      'has-text-link',
                      {
                        'has-text-link': person.sex === MALE_SEX,
                        'has-text-danger': person.sex === FEMALE_SEX,
                      },
                    )}
                    onClick={(event) => handleSelect(event, person)}
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
