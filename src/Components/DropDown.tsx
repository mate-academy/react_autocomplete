import debounce from 'lodash.debounce';
import { useCallback, useMemo, useState } from 'react';
import { Person } from '../types/Person';

type DropDownProps = {
  people: Person[],
  onSelected?: (person: Person) => void
};

export const DropDown: React.FC<DropDownProps> = ({
  people,
  onSelected = () => { },
}) => {
  const [active, setActive] = useState(false);
  const [text, setText] = useState('');
  const [value, setValue] = useState('');

  const handlerActive = (condition: boolean) => {
    setActive(condition);
  };

  const applyQuery = useCallback(
    debounce(setValue, 1000), [],
  );

  const filteredPeople = useMemo(() => {
    return people.filter(
      person => person.name.toLowerCase().includes(value.toLowerCase()),
    );
  }, [value, people]);

  const handlerPerson = (human: Person) => {
    onSelected(human);
    setText(human.name);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={text}
          onClick={() => handlerActive(!active)}
          onBlur={() => handlerActive(false)}
          onChange={(event) => {
            setActive(true);
            setText(event.target.value);
            applyQuery(event.target.value);
          }}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {active && filteredPeople.map((person) => (
            <div
              className="dropdown-item"
              key={person.slug}
            >
              <a
                href="/"
                onMouseDown={() => {
                  handlerPerson(person);
                }}

              >
                <p className="has-text-link">{person.name}</p>
              </a>
            </div>
          ))}
        </div>
      </div>

      {!filteredPeople.length && (
        <div className="message">
          No matching suggestions
        </div>
      )}
    </div>
  );
};
