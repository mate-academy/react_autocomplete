import classNames from 'classnames';
import {
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  setSelectedPerson:(person: Person)=> void;
  delay:number;
};

export const People: React.FC<Props> = ({
  people,
  setSelectedPerson,
  delay,
}) => {
  const [hasInputFocus, setHasInputFocus] = useState(false);
  const [query, setQuery] = useState('');
  const [querywithdelay, setQuerywithdelay] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const aplayquerywithdelay = useCallback(
    debounce(setQuerywithdelay, delay), [],
  );
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement >) => {
    setQuery(event.target.value.toLowerCase().trim());
    aplayquerywithdelay(event.target.value.toLowerCase().trim());
  };

  const filteredPeople = useMemo(() => {
    return people.filter((person) => {
      return person.name.toLowerCase().includes(querywithdelay);
    });
  }, [querywithdelay, people]);

  const handleSelectPerson = (item: Person) => {
    setSelectedPerson(item);
    setQuery(item.name);
    setQuerywithdelay(item.name);
  };

  const inputfocus = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputfocus.current && hasInputFocus) {
      inputfocus.current.focus();
    }
  }, [hasInputFocus]);

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
          ref={inputfocus}
          onChange={handleQueryChange}
          onClick={() => setHasInputFocus(true)}
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
                tabIndex={0}
                role="button"
                onMouseDown={() => handleSelectPerson(item)}
              >
                <p className="has-text-link">
                  {item.name}
                </p>
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
