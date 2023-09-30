import {
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Person } from '../types/Person';

type Props = {
  list: Person[];
  onSelected: (person: Person) => void;
  delay: number;
};

export const Autocomplete: React.FC<Props> = ({ list, onSelected, delay }) => {
  const [hasInputFocus, setHasInputFocus] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  function debounce(callback: (value: string) => void, timeToChange: number) {
    let timerId = 0;

    return (arg: string) => {
      window.clearTimeout(timerId);

      timerId = window.setTimeout(() => {
        callback(arg);
      }, timeToChange);
    };
  }

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  function handleQueryChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  }

  const filtedList = useMemo(() => {
    return list.filter(item => item.name.includes(appliedQuery));
  }, [list, appliedQuery]);

  function handleSelection(item: Person) {
    onSelected(item);
    setQuery(item.name);
    setAppliedQuery(item.name);
  }

  return (
    <div className={hasInputFocus ? 'dropdown is-active' : 'dropdown'}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={query}
          onChange={handleQueryChange}
          onFocus={() => setHasInputFocus(true)}
          onBlur={() => setHasInputFocus(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filtedList.length > 0 ? (
            filtedList.map(item => (
              <div
                className="dropdown-item"
                key={item.name}
                role="button"
                tabIndex={0}
                onMouseDown={() => handleSelection(item)}
              >
                <p className="has-text-link">{item.name}</p>
              </div>
            ))
          ) : (
            <p className="notification is-warning">No matching suggestions</p>
          )}
        </div>
      </div>
    </div>
  );
};
