import { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';
import { DropDownMenu } from './DropDownMenu/DropDownMenu';
import { MESSAGES } from '../../enums';

type Props = {
  people: Person[];
  delay?: number,
  onSelect?: (person: Person | null) => void;
};

export const PersonSelect: React.FC<Props> = ({
  people,
  delay = 1000,
  onSelect = () => {},
}) => {
  const [isActive, setIsActive] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(
    debounce((value: string) => setAppliedQuery(value), delay),
    [delay, setAppliedQuery],
  );

  const filteredPeople = useMemo(() => {
    const lowerCasedQuery = appliedQuery.toLowerCase();

    return people.filter(person => (
      person.name.toLowerCase().includes(lowerCasedQuery)
    ));
  }, [appliedQuery, people]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value) {
      onSelect(null);
    }

    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleFocus = () => {
    setIsActive(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      if (!document.activeElement?.closest('.dropdown')) {
        setIsActive(false);
      }
    }, 0);
  };

  const handlePersonSelect = (person: Person) => {
    setQuery(person.name);
    setAppliedQuery(person.name);
    onSelect(person);
    setIsActive(false);
  };

  return (
    <div className={classNames('dropdown', { 'is-active': isActive })}>
      <div className="dropdown-trigger">
        <input
          type="text"
          className="input"
          placeholder={MESSAGES.personSelectInputPlaceholder}
          value={query}
          onChange={handleQueryChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>

      <DropDownMenu
        people={filteredPeople}
        onSelect={handlePersonSelect}
      />
    </div>
  );
};
