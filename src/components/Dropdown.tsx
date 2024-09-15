import {
  FC,
  useState,
  ChangeEvent,
  FocusEvent,
  memo,
  useCallback,
} from 'react';
import debounce from 'lodash.debounce';
import cn from 'classnames';

import { Person } from '../types/Person';

import './Dropdown.scss';

interface Props {
  people: Person[];
  delay?: number;
  onChangeQuery: (query: string) => void;
  onSelectPerson: (person: Person | null) => void;
}

const Dropdown: FC<Props> = ({
  people,
  delay = 300,
  onSelectPerson,
  onChangeQuery,
}) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const debouncedOnChangeQuery = useCallback(
    debounce((str: string) => {
      onChangeQuery(str);
    }, delay),
    [delay, onChangeQuery],
  );

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    onSelectPerson(null);
    debouncedOnChangeQuery(event.target.value);
  };

  const handleFocus = () => {
    setOpenDropdown(prev => !prev);
  };

  const handleBlur = (event: FocusEvent<HTMLInputElement, Element>) => {
    if (!event.relatedTarget) {
      setOpenDropdown(prev => !prev);
    }
  };

  const handleClick = (person: Person) => {
    setSearchValue(person.name);
    onSelectPerson(person);
    onChangeQuery('');
    setOpenDropdown(prev => !prev);
  };

  return (
    <div>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={searchValue}
            onChange={handleQueryChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        {openDropdown && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content ">
              {people.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  onClick={() => handleClick(person)}
                >
                  <p
                    tabIndex={0}
                    className={cn({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Dropdown);
