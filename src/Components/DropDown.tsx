import debounce from 'lodash.debounce';
import { useCallback, useMemo, useState } from 'react';
import { Person } from '../types/Person';

type DropDownProps = {
  people: Person[],
  onSelect: (person: Person) => void
};

export const DropDown: React.FC<DropDownProps> = ({
  people,
  onSelect = () => { },
}) => {
  const [isActive, setIsActive] = useState(false);
  const [text, setText] = useState('');
  const [value, setValue] = useState('');

  const handleIsActive = () => {
    setIsActive(prev => !prev);
  };

  const handleIsBlur = () => {
    setIsActive(false);
  };

  const applyQuery = useCallback(
    debounce(setValue, 1000), [],
  );

  const filteredPeople = useMemo(() => {
    return people.filter(
      person => person.name.toLowerCase().includes(value.toLowerCase()),
    );
  }, [value, people]);

  const handlePersonSelect = (human: Person) => {
    onSelect(human);
    setText(human.name);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsActive(true);
    setText(event.target.value);
    applyQuery(event.target.value);
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={text}
          onClick={handleIsActive}
          onBlur={handleIsBlur}
          onChange={handleInputChange}
        />
      </div>

      {isActive && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {isActive && filteredPeople.map((person) => (
              <div
                className="dropdown-item"
                key={person.slug}
              >
                <a href="/" onMouseDown={() => handlePersonSelect(person)}>
                  <p className="has-text-link">{person.name}</p>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {!filteredPeople.length && (
        <div className="message">
          No matching suggestions
        </div>
      )}
    </div>
  );
};
