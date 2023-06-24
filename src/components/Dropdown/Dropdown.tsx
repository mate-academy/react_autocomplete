import {
  FC,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Person } from '../../types/Person';
import { DropdownMenu } from './DropdownMenu';
import { DropdownInput } from '../DropdownInput';
import { debounce } from '../../helpers/debounce';

interface Props {
  people: Person[];
  delay: number,
}

export const Dropdown:FC<Props> = ({ people, delay }) => {
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

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <DropdownInput
          applyFilterQuery={applyFilterQuery}
          setSelectMenuVisible={setSelectMenuVisible}
        />
      </div>

      {selectMenuVisible
      && <DropdownMenu preparedPersons={preparedPeople} />}
    </div>
  );
};
