import { useState } from 'react';
import { Person } from '../types/Person';
import classNames from 'classnames';

type AutocompleteProps = {
  delay: number;
  people: Person[];
  setPerson: React.Dispatch<React.SetStateAction<Person | null>>;
};

export const Autocomplete: React.FC<AutocompleteProps> = ({
  delay,
  people,
  setPerson,
}) => {
  const [query, setQuery] = useState('');
  const [suggest, setSuggest] = useState<Person[]>(people);
  const [dropDownOpen, setDropDownOpen] = useState(false);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    setPerson(null);
    setDropDownOpen(true);
    setQuery(newQuery);

    setTimeout(() => {
      const filtered = people.filter(pers =>
        pers.name.toLowerCase().includes(newQuery.toLowerCase()),
      );

      setSuggest(filtered);
    }, delay);
  };

  const handleItemClick = (item: Person) => {
    setPerson(item);
    setDropDownOpen(false);
    setQuery(item?.name);
  };

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setDropDownOpen(true)}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          {!!suggest.length && dropDownOpen && (
            <div className="dropdown-content">
              {suggest.map(item => (
                <div
                  className="dropdown-item"
                  data-cy="suggestion-item"
                  key={item.slug}
                  onClick={() => handleItemClick(item)}
                >
                  <p
                    className={classNames({
                      'has-text-link': item.sex === 'm',
                      'has-text-danger': item.sex === 'f',
                    })}
                  >
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {!suggest.length && (
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
