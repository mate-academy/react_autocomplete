import { useCallback, useMemo, useState } from 'react';
import './DropdownInput.scss';
import { peopleFromServer } from '../data/people';
import { ListItem } from '../ListItem';
import { Person } from '../types/Person';

// eslint-disable-next-line @typescript-eslint/ban-types
function debounce(callback: Function, delay = 1000) {
  let timerId = 0;

  return (...args: any[]) => {
    window.clearTimeout(timerId);
    timerId = window.setTimeout(callback, delay, ...args);
  };
}

interface Props {
  onSelect: (p: Person) => void;
}

export const DropdownInput: React.FC<Props> = ({ onSelect }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [querry, setQuerry] = useState('');
  const [delayedQerry, setDelayedQerry] = useState('');
  const [delay, setDelay] = useState(500);
  const showList = querry === delayedQerry;

  const handleQuerry = useCallback(debounce(setDelayedQerry, delay), [delay]);

  function filterPeople(people: Person[], querryForFilter: string): Person[] {
    let peopleCopy = [...people];
    const normalizedQuerry = querryForFilter.toLowerCase().trim();

    if (normalizedQuerry) {
      peopleCopy = peopleCopy.filter(
        person => person.name.toLowerCase().includes(normalizedQuerry),
      );
    }

    return peopleCopy;
  }

  const visiblePeople = useMemo(
    () => filterPeople(peopleFromServer, delayedQerry),
    [delayedQerry],
  );

  function handleInput(event: React.ChangeEvent<HTMLInputElement>):void {
    setQuerry(event.target.value);
    handleQuerry(event.target.value);
  }

  const selectPerson = (person: Person) => {
    onSelect(person);
    setIsFocused(false);
    setQuerry(person.name);
  };

  return (
    <section className="searchSection">
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={querry}
            onChange={handleInput}
            onFocus={() => setIsFocused(true)}
          />
        </div>

        {isFocused && showList && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {visiblePeople.length > 0 && visiblePeople.map(
                person => (
                  <ListItem
                    key={person.slug}
                    person={person}
                    onSelect={selectPerson}
                  />
                ),
              )}

              {visiblePeople.length < 1 && (
                <p className="dropdown-item">No matching suggestions</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="field-input">
        Delay:
        <input
          name="delayInput"
          className="input input-width  is-small"
          type="number"
          value={delay}
          step={100}
          min={100}
          onChange={(e) => setDelay(+e.target.value)}
          placeholder="Enter delay"
        />
      </div>
    </section>
  );
};
