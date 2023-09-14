import classNames from 'classnames';
import { useMemo, useState, useCallback } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';

type Props = {
  people: Person[],
  setSelectedPerson?: (person: Person | null) => void,
  setTitle: (title: string) => void,
};

export const Autocomplate: React.FC<Props> = ({
  people,
  setSelectedPerson = () => { },
  setTitle = () => { },
}) => {
  const [isListOpened, setIsListOpened] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [appliedQuery, setApplyQuery] = useState('');

  const openList = () => setIsListOpened(true);
  const closeList = () => setIsListOpened(false);

  const applyQuery = useCallback(
    debounce(setApplyQuery, 1000),
    [],
  );

  const handleInputValueChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setInputValue(event.target.value);
    applyQuery(event.target.value);
    const { length } = event.target.value;

    if (!length) {
      setTitle('');
    }
  };

  const filterPeople = useMemo(() => {
    return people
      .filter(({ name }) => name.toLowerCase().includes(inputValue));
  }, [people, appliedQuery]);

  return (
    <div
      className={classNames('dropdown', {
        'is-active': isListOpened,
      })}
    >
      <div className="dropdown-trigger">
        <input
          value={inputValue}
          onFocus={openList}
          onBlur={() => setTimeout(closeList, 200)}
          onChange={handleInputValueChange}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {filterPeople.length ? (
            filterPeople.map(person => (
              <button
                key={person.slug}
                className="dropdown-item"
                type="button"
                onClick={() => {
                  setTitle(person.name);
                  setInputValue(person.name);
                  setSelectedPerson(person);
                  closeList();
                }}
              >
                {person.name}
              </button>
            ))
          ) : (
            <div className="dropdown-item">
              <p>No matching suggestions</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
