import cn from 'classnames';
import './Dropdown.scss';
import { Person } from '../../types/Person';
import { useState, useMemo, useCallback } from 'react';
import { debounce } from '../../services/debounce';

type Props = {
  peopleList: Person[];
  onSelected?: (person: Person | null) => void;
  delay: number;
};

export const Dropdown: React.FC<Props> = ({
  peopleList,
  onSelected = () => {},
  delay,
}) => {
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(false);
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(debounce(setAppliedQuery, delay), []);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  }

  const filteredPeople = useMemo(() => {
    return peopleList.filter(person => {
      const nameToLowerCase = person.name.toLowerCase();
      const quetyToLowerCase = appliedQuery.toLowerCase();

      return nameToLowerCase.includes(quetyToLowerCase);
    });
  }, [peopleList, appliedQuery]);


  const handleSelect = (person: Person) => {
    onSelected(person);
    setQuery(person.name);
    setAppliedQuery(person.name);
    setVisible(false);
  };


  return (
    <div className={cn('dropdown', {'is-active': visible})}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setVisible(true)}
          onBlur={() => setVisible(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {
            filteredPeople.length
            ? (
              filteredPeople.map(person => (
                <div
                  className="dropdown-item dropdown-item--hover"
                  style={{}}
                  key={person.slug}
                  onMouseDown={() => handleSelect(person)}
                  onKeyDown={() => handleSelect(person)}
                >
                  <p className={cn('has-text-link', {
                    'has-text-danger': person.sex === 'f'
                  })}
                  >
                    {person.name}
                  </p>
                </div>
              ))
            ) : (
              <div className="dropdown-item">
                <p>No matching suggestions</p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};
