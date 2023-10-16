import classNames from 'classnames';
import {
  useCallback,
  useMemo,
  useState,
} from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay: number;
};

function debounce(
  callback: (value: string) => void,
  delay: number,
) {
  let timerId = 0;

  return (args: string) => {
    window.clearTimeout(timerId);

    timerId = window.setTimeout(() => {
      callback(args);
    }, delay);
  };
}

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  delay,
}) => {
  const [hasInputFocus, setHasInputFocus] = useState(false);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  const applyQuery = useCallback(
    (quiz) => debounce(setAppliedQuery, delay)(quiz),
    [setAppliedQuery, delay],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelected(people.find(({ name }) => name === event.target.value) || null);
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const filteredPeople = useMemo(() => {
    return people.filter(person => person.name.includes(appliedQuery));
  }, [people, appliedQuery]);

  const handleSelection = (person: Person) => {
    onSelected(person);
    setQuery(person.name);
    setAppliedQuery(person.name);
  };

  return (
    <div className={classNames('dropdown', {
      'is-active': hasInputFocus,
    })}
    >
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

      <div
        className="dropdown-menu"
        role="menu"
      >

        {filteredPeople.length > 0 ? (
          <div className="dropdown-content">
            {filteredPeople.map(item => (
              <div
                className="dropdown-item"
                key={item.name}
                role="button"
                tabIndex={0}
                onMouseDown={() => handleSelection(item)}
              >
                <p className="has-text-link">{item.name}</p>
              </div>
            ))}

          </div>
        ) : (
          <p className="notification is-info">
            No matching suggestions
          </p>
        )}
      </div>
    </div>
  );
};
