import { useCallback, useState } from 'react';
import { Person } from '../../types/Person';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import './Autocomplete.scss';

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

  const aplyQuery = useCallback(
    debounce(value => setApliedQuery(value), delay),
    [delay],
  );

  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      setQuery(value);
      aplyQuery(value);
    },
    [setQuery, aplyQuery],
  );

  const onClick = (person: Person) => {
    setSelectedPerson(person);
    setFocus(false);
    setApliedQuery('');
    setQuery('');
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setFocus(false);
    }, 300);
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

        {focus && filteredPeople.length !== 0 && (
          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.map(person => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={people.indexOf(person)}
                >
                  <p
                    className={classNames('option', {
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                    onClick={() => onClick(person)}
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
