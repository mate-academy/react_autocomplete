import { ChangeEventHandler, FC, useContext, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Person } from '../../types/Person';
import { useTimeout } from '../../utils';
import { PeopleContext } from '../../App';

interface Props {
  delay?: number;
}

export const Autocomplete: FC<Props> = ({ delay = 300 }) => {
  const { people, onSelect } = useContext(PeopleContext);
  const [isSuggestionVisible, setIsSuggestionVisible] = useState(false);
  const [startShowTimeout] = useTimeout(
    () => setIsSuggestionVisible(true),
    delay,
  );
  const [inputValue, setInputValue] = useState('');
  const [sugestedPeople, setSuggestetPeople] = useState(people);

  useMemo(() => {
    if (isSuggestionVisible) {
      const newSuggestedPeople = people.filter(person =>
        person.name
          .toLocaleLowerCase()
          .includes(inputValue.toLocaleLowerCase()),
      );

      setSuggestetPeople(newSuggestedPeople);
    }
  }, [people, inputValue, isSuggestionVisible]);

  const getHandleSugestionClick = (person: Person) => () => {
    setInputValue(person.name);
    onSelect(person.slug);
    setIsSuggestionVisible(false);
  };

  const handleInputFocus = () => {
    startShowTimeout();
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = event => {
    setIsSuggestionVisible(false);
    onSelect(null);
    setInputValue(event.target.value);
    startShowTimeout();
  };

  return (
    <>
      <div
        className={classNames('dropdown', {
          'is-active': isSuggestionVisible,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={inputValue}
            data-cy="search-input"
            onFocus={handleInputFocus}
            onChange={handleInputChange}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {sugestedPeople.map(person => (
              <div
                key={person.slug}
                className="dropdown-item"
                data-cy="suggestion-item"
              >
                <p
                  className="has-text-link"
                  onClick={getHandleSugestionClick(person)}
                >
                  {person.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {!sugestedPeople.length && (
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
