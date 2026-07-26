import { useState, useEffect } from 'react';
import { peopleFromServer } from '../data/people';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  onSelected: (person: Person | null) => void;
};
export const Autocomplete = ({ onSelected }: Props) => {
  const [text, setText] = useState('');
  const [tip, setTip] = useState(peopleFromServer);
  const [open, setOpen] = useState(false);

  const handleOnFocus = () => {
    if (text === '') {
      setOpen(true);
      setTip(peopleFromServer);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (text === '') {
        setTip(peopleFromServer);
      } else {
        const filtered = peopleFromServer.filter(person =>
          person.name.toLowerCase().includes(text.toLowerCase()),
        );

        setTip(filtered);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [text]);

  const handleSelect = (person: Person) => {
    setText(person.name);
    setOpen(false);
    onSelected(person);
  };

  return (
    <div
      className={classNames('dropdown', {
        'is-active': open,
      })}
    >
      <div className="dropdown-trigger">
        <input
          className="input"
          type="text"
          placeholder="Enter a part of the name"
          data-cy="search-input"
          value={text}
          onChange={event => {
            setText(event.target.value);
            setOpen(true);
            onSelected(null);
          }}
          onFocus={handleOnFocus}
        />
      </div>

      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {tip.length > 0 ? (
            tip.map(person => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={person.slug}
                onClick={() => handleSelect(person)}
              >
                <p>{person.name}</p>
              </div>
            ))
          ) : (
            <div
              className="notification is-danger is-light"
              data-cy="no-suggestions-message"
            >
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
