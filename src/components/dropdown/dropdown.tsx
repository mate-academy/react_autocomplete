import cn from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';
import { DropdownMenu } from '../dropdownMenu/dropdownMenu';

interface Props {
  people: Person[];
  value: string;
  showList: boolean;
  onIsShowList: (val: boolean) => void;
  onFilteringPeopleList: (value: string) => void;
  onChangeSelPerson: (person: Person) => void;
}

export const Dropdown: React.FC<Props> = ({
  people,
  value,
  showList,
  onIsShowList,
  onFilteringPeopleList,
  onChangeSelPerson,
}) => {
  const handleToggleListDelayed = debounce(() => onIsShowList(true), 300);

  return (
    <div className={cn('dropdown', { 'is-active': showList })}>
      <div className="dropdown-trigger" onClick={handleToggleListDelayed}>
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={value}
          onChange={event => onFilteringPeopleList(event.target.value)}
          onBlur={() => onIsShowList(false)}
          onFocus={() => onIsShowList(true)}
        />
      </div>

      {people.length !== 0 && (
        <DropdownMenu people={people} onChangeSelPerson={onChangeSelPerson} />
      )}
    </div>
  );
};
