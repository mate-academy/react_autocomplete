import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash/debounce';
import { Person } from './types/Person';

type Props = {
  delay?: number;
  onSelected?: (person: Person) => void;
};

export const App: React.FC<Props> = ({
  delay = 300,
  onSelected = () => {},
}) => {
  const [text, setText] = useState('');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Person | null>(null);

  const debounced = useRef(debounce(setQuery, delay)).current;

  useEffect(() => () => debounced.cancel(), [debounced]);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();

    return search
      ? peopleFromServer.filter(p => p.name.toLowerCase().includes(search))
      : peopleFromServer;
  }, [query]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setText(value);
    setSelected(null);
    if (value !== query) {
      debounced(value);
    }
  };

  const handleSelect = (person: Person) => {
    setText(person.name);
    setQuery(person.name);
    setSelected(person);
    setOpen(false);
    onSelected?.(person);
  };

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selected
            ? `${selected.name} (${selected.born} - ${selected.died})`
            : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
              value={text}
              onChange={handleChange}
              onFocus={() => setOpen(true)}
            />
          </div>
          {open && filtered.length > 0 && (
            <div
              className="dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              <div className="dropdown-content">
                {filtered.map(person => (
                  <div
                    className="dropdown-item"
                    data-cy="suggestion-item"
                    key={person.slug}
                    onClick={() => handleSelect(person)}
                  >
                    <p
                      className={
                        person.sex === 'm' ? 'has-text-link' : 'has-text-danger'
                      }
                    >
                      {person.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {open && filtered.length === 0 && (
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
      </main>
    </div>
  );
};
