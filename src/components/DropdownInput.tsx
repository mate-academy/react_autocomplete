import { useCallback, useMemo, useState } from 'react';
import './DropdownInput.scss';
import { peopleFromServer } from '../data/people';
import { ListItem } from '../ListItem';
import { Person } from '../types/Person';
import { debounce } from '../utils/debounce';
import { filterPeople } from '../utils/filterPeople';

interface Props {
  onSelect : (p: Person) => void;
}

export const DropdownInput: React.FC<Props> = ({ onSelect }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [querry, setQuerry] = useState('');
  const [delayedQerry, setDelayedQerry] = useState('');
  const [delay, setDelay] = useState(500);
  const showList = querry === delayedQerry;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleQuerry = useCallback(debounce(setDelayedQerry, delay), [delay]);

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
