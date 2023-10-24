import { debounce } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import cn from 'classnames';
import { Person } from '../../types/Person';
import { PeopleList } from '../PeopleList';

interface Props {
  users: Person[];
  delay: number;
  onSelected?: (person: Person | null) => void;
}

export const Dropdown: React.FC<Props> = ({
  users,
  delay,
  onSelected = () => { },
}) => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const filteredPeople: Person[] = useMemo(() => {
    return users.filter(person => person.name.toLowerCase()
      .includes(appliedQuery.trim().toLowerCase()));
  }, [appliedQuery]);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [appliedQuery],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleOnSelected = (person: Person) => {
    onSelected(person);
    setQuery(person.name);
    setAppliedQuery(person.name);
    setIsVisible(false);
  };

  return (
    <div className={cn('dropdown', { 'is-active': isVisible })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setIsVisible(true)}
          onBlur={() => setIsVisible(false)}
        />
      </div>
      <PeopleList
        users={filteredPeople}
        onSelect={handleOnSelected}
      />
    </div>
  );
};
