import { useCallback, useState } from 'react';
import { Person } from '../../types/Person';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

type Props = {
  delay?: number;
  people: Person[];
  setSelectedPerson: (person: Person) => void;
};

export const Autocomplete: React.FC<Props> = ({
  delay = 300,
  people,
  setSelectedPerson,
}) => {
  const [query, setQuery] = useState('');
  const [aplliedQuery, setApliedQuery] = useState('');
  const [focus, setFocus] = useState(false);

  const aplyQuery = useCallback(debounce(setApliedQuery, delay), []);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    aplyQuery(event.target.value);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setFocus(false);
    }, 1);
  };

  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(aplliedQuery.toLowerCase()),
  );

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onFocus={() => setFocus(true)}
            onBlur={() => handleInputBlur()}
            onChange={onInputChange}
            data-cy="search-input"
          />
        </div>

        {focus && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={people.indexOf(person)}
                >
                  <p
                    className={classNames('', {
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                    onClick={() => {
                      setSelectedPerson(person);
                      setFocus(false);
                      setApliedQuery('');
                      setQuery('');
                    }}
                  >
                    {person.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {focus && filteredPeople.length === 0 && (
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
