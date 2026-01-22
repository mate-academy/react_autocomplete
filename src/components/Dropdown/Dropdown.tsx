import React, { useState } from 'react';
import { Person } from '../../types/Person';
import { Input } from '../Input/Input';

type Props = {
  users: Person[];
  query: string;
  delay?: number;
  handleOnChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    delay?: number,
  ) => void;
  onSelectPerson: (person: Person) => void;
};

export const Dropdown: React.FC<Props> = ({
  users,
  handleOnChange,
  query,
  delay,
  onSelectPerson,
}) => {
  const [focus, setFocus] = useState(false);

  const handleOnFocusChange = (isFocused: boolean) => {
    setFocus(isFocused);
  };

  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <Input
            onChange={handleOnChange}
            query={query}
            onFocusChange={handleOnFocusChange}
            delay={delay}
          />
        </div>
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          {focus && (
            <div className="dropdown-content">
              {users.map(user => (
                <div
                  key={user.slug}
                  className="dropdown-item"
                  data-cy="suggestion-item"
                >
                  <p
                    onMouseDown={() => onSelectPerson({ ...user })}
                    className="has-text-link"
                  >
                    {user.name}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
