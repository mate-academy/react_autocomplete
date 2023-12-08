import cn from 'classnames';
import debounce from 'lodash.debounce';
import { useMemo, useState } from 'react';
import { Person } from '../../types/Person';
import './Dropdown.scss';
import { DropdownContent } from '../DropdownContent/DropdownContent';
import { DropdownInput } from '../DropdownInput/DropdownInput';

interface Props {
  people: Person[];
  onSelect: (person: Person) => void;
  searchDelay: number;
}

export const Dropdown: React.FC<Props> = (props) => {
  const { people, onSelect, searchDelay } = props;

  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const peopleForDisplay = useMemo(
    () => people.filter(person => {
      const preparedName = person.name.toLowerCase();
      const preparedQuery = appliedQuery.toLowerCase();

      return preparedName.includes(preparedQuery);
    }),
    [appliedQuery, people],
  );

  const applyQuery = useMemo(
    () => debounce((query) => {
      setAppliedQuery(query.trim());
      setIsFocused(true);
    }, searchDelay),
    [searchDelay],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setIsFocused(false);
    applyQuery(event.target.value);
  };

  return (
    <div className={cn('dropdown', { 'is-active': isFocused })}>
      <DropdownInput
        onFocus={setIsFocused}
        searchQuery={searchQuery}
        onChange={handleQueryChange}
      />

      <DropdownContent
        people={peopleForDisplay}
        setSearchQuery={setSearchQuery}
        setAppliedQuery={setAppliedQuery}
        onSelect={onSelect}
      />
    </div>
  );
};
