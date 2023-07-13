import {
  FC, MouseEvent, useState, useCallback, useMemo, ChangeEvent, memo,
} from 'react';
import classNames from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  onSelected: (person: Person) => void;
  selectedPerson: Person | null;
  delay: number;
};

const debounce = (callback: (...args: any) => void, delay: number) => {
  let timerId = 0;

  return (...args: any) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
};

export const Dropdown: FC<Props> = memo((props) => {
  const {
    people,
    onSelected,
    selectedPerson,
    delay,
  } = props;

  const [query, setQuery] = useState<string>(selectedPerson?.name || '');
  const [appliedQuery, setAppliedQuery] = useState<string>('');

  const handleSelectPerson = (
    event: MouseEvent<HTMLAnchorElement>,
    person: Person,
  ) => {
    event.preventDefault();

    onSelected(person);
    setQuery(person.name);
    setAppliedQuery('');
  };

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleChangeQuery = (event: ChangeEvent<HTMLInputElement>) => {
    const currentQuery = event.target.value;

    setQuery(currentQuery);
    applyQuery(currentQuery);
  };

  const filteredPeople = useMemo(() => {
    return people.filter(person => {
      return person.name.toLowerCase().includes(appliedQuery.toLowerCase());
    });
  }, [appliedQuery]);

  const dropDownIsVisible = appliedQuery
    && appliedQuery === query;

  const errorIsVisible = filteredPeople.length === 0;

  return (
    <div className={classNames('dropdown', {
      'is-active': dropDownIsVisible,
    })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleChangeQuery}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {errorIsVisible ? (
            <p className="dropdown-item">
              No matching suggestions
            </p>
          ) : (
            filteredPeople.map((person) => (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <a
                key={person.slug}
                className="dropdown-item"
                href="#"
                onClick={(event) => handleSelectPerson(event, person)}
              >
                <p
                  className={classNames({
                    'has-text-link': person.sex === 'm',
                    'has-text-danger': person.sex === 'f',
                  })}
                >
                  {person.name}
                </p>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
});
