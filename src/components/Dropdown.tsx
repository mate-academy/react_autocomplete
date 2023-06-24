import {
  FC,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Person } from '../types/Person';
import { DropdownMenu } from './DropdownMenu';

interface Props {
  people: Person[];
}

const debounce = (f:TimerHandler, delay: number) => {
  let timeoutID: number;

  return (...args:string[]) => {
    clearTimeout(timeoutID);
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    timeoutID = setTimeout(f, delay, ...args);
  };
};

export const Dropdown:FC<Props> = ({ people }) => {
  const [query, setQuery] = useState<string>('');
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
      setSelectMenuVisible(true);
      setFilterQuery(text);
    }, [],
  );

  const applyFilterQuery = useCallback(
    debounce(handleFilterQueryUpdate, 1000),
    [],
  );

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectMenuVisible(false);
            applyFilterQuery(e.target.value);
          }}
        />
      </div>

      {selectMenuVisible && <DropdownMenu preparedPersons={preparedPeople} />}
    </div>
  );
};
