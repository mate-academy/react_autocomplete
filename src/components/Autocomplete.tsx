import { ChangeEventHandler, useContext, useMemo, useState } from 'react';
import classNames from 'classnames';
import { PeopleContext } from './PeopleContext';
import { Person } from '../types/Person';
import { useTimeout } from './UseTimeout';

type Props = {
  delay?: number;
};

export const Autocomplete: React.FC<Props> = ({ delay = 300 }) => {
  const { people, onSelect } = useContext(PeopleContext);
  const [inputValue, setInputValue] = useState('');
  const [filteredPeople, setFilteredPeople] = useState(people);
  const [isVisible, setIsVisible] = useState(false);
  const [showTimeout] = useTimeout(() => setIsVisible(true), delay);

  useMemo(() => {
    if (isVisible) {
      const filteredP = people.filter((person: Person) =>
        person.name.toLowerCase().includes(inputValue.toLowerCase()),
      );

      setFilteredPeople(filteredP);
    }
  }, [people, inputValue, isVisible]);

  const handleInputFocus = () => {
    showTimeout();
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = e => {
    setIsVisible(false);
    onSelect(null);
    setInputValue(e.target.value);
    showTimeout();
  };

  const handleClick = (person: Person) => () => {
    setInputValue(person.name);
    onSelect(person.slug);
    setIsVisible(false);
  };

  return (
    <>
      <div
        className={classNames('dropdown', {
          'is-active': isVisible,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            onChange={handleInputChange}
            onFocus={handleInputFocus}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filteredPeople.map((person: Person) => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.slug}
              >
                <p className="has-text-link" onClick={handleClick(person)}>
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!filteredPeople.length && (
        <div
          className="
          notification
          is-danger
          is-light
          mt-3
          is-align-self-flex-start
        "
          role="alert"
          data-cy="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      )}
    </>
  );
};
