import {
  FC,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Person } from '../../types/Person';
import { DropdownMenu } from './DropdownMenu';
import { DropdownInput } from './DropdownInput';
import { debounce } from '../../helpers/debounce';
import { ContextType, DropdownDataContext } from './DropdownData';

interface Props {
  people: Person[];
  delay: number,
  onSelectPerson: React.Dispatch<React.SetStateAction<Person | null>>,
}
// TODO: FIX THAT PROPS SHARING SHIT USING CONTEXT

export const Dropdown:FC<Props> = ({ people, delay, onSelectPerson }) => {
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [selectMenuVisible, setSelectMenuVisible] = useState<boolean>(false);

  const preparedPeople = useMemo(() => {
    return people.filter(person => {
      const searchQuery = new RegExp(filterQuery.trim(), 'i');

      if (filterQuery.trim()) {
        return searchQuery.test(person.name);
      }

      return false;
    });
  }, [filterQuery]);

  const handleFilterQueryUpdate = useCallback(
    (text: string) => {
      setSelectMenuVisible(!!text);
      setFilterQuery(text);
    }, [],
  );

  const applyFilterQuery = useCallback(
    debounce(handleFilterQueryUpdate, delay),
    [],
  );

  const dropDownData = useMemo<ContextType>(() => ({
    setSelectMenuVisible,
    onSelectPerson,
    preparedPeople,
    applyFilterQuery,
  }), [preparedPeople]);

  return (
    <DropdownDataContext.Provider value={dropDownData}>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <DropdownInput />
        </div>

        {selectMenuVisible
        && (
          <DropdownMenu />
        )}
      </div>
    </DropdownDataContext.Provider>
  );
};
