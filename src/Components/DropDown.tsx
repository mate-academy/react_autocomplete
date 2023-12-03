import debounce from 'lodash.debounce';
import { useCallback, useMemo, useState } from 'react';
import { Person } from '../types/Person';

type DropDownProps = {
  people: Person[],
};

export const DropDown: React.FC<DropDownProps> = ({
  people,
}) => {
  const [active, setActive] = useState(false);
  const [text, setText] = useState('');
  const [value, setValue] = useState('');

  console.log(text);
  console.log(value);

  const handlerActive = (condition: boolean) => {
    setActive(condition);
  };

  const applyQuery = useCallback(
    debounce(setValue, 1000), [],
  );

  const filteredPeople = useMemo(() => {
    return people.filter(
      person => person.name.toLowerCase().includes(value),
    );
  }, [value, people]);

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
            setText(event.target.value);
            applyQuery(event.target.value);
          }}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {active && filteredPeople.map((person, index) => (
            <div
              className="dropdown-item"
              key={person.slug}
              role="menuitem"
              tabIndex={index}
              onClick={() => { }}
              onKeyDown={() => { }}
            >
              <p className="has-text-link">{person.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
