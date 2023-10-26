import classNames from 'classnames';
import {
  useMemo,
  useState,
  useCallback,
  useRef,
  useEffect,
} from 'react';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  slectedPerson:(person: Person)=> void;
  delay:number;
};
function debounce (callback:Function, delay:number) {
  let timerId = 0;
  return (...arg: any) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(() =>{
      callback(...arg);
    }, delay);
  };
}

export const People: React.FC<Props> = ({
  people,
  slectedPerson,
  delay
}) => {
  
  const [hasInputFocus, setHasInputFocus] = useState(false);
  const [query, setQuery] = useState('');
  const [querywithdelay, setQuerywithdelay] = useState('');
  
  const aplayquerywithdelay = useCallback(
    debounce(setQuerywithdelay,delay),[]
  )

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value.toLowerCase().trim());
    aplayquerywithdelay(event.target.value.toLowerCase().trim())
  };

  const filteredPeople = useMemo(() => {
    
      return people.filter(person => person.name.toLowerCase().includes(querywithdelay));

  }, [ querywithdelay]);

  const handleSelectPerson = (item: Person) => {
    slectedPerson(item);
    setQuery(item.name)
    setQuerywithdelay(item.name)
  };

  const inputfocus = useRef<HTMLInputElement>(null)
  
  useEffect(()=>{
    if (inputfocus.current && hasInputFocus) {
      inputfocus.current.focus()
    }
    
  },[hasInputFocus])
  
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
                role="button"
                onMouseDown={() => handleSelectPerson(item)}
              >
                <p className="has-text-link"
                >
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