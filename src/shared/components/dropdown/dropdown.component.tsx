import React, { useState } from 'react';
import { DropdownProps } from './dropdown.types';
import { TextFieldComponent } from '../textField/textField.component';
import { Person } from '../../../types/Person';
import classNames from 'classnames';

export const DropdownComponent: React.FC<DropdownProps> = ({
  people,
  setSelectedPerson,
  value = '',
  onChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleBlur = () => {
    setTimeout(() => setIsFocused(false), 200);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleSelectPerson = (person: Person) => {
    setSelectedPerson(person);
    onChange({ target: { value: person.name } });
  };

  return (
    <div className={classNames('dropdown', { 'is-active': isFocused })}>
      <TextFieldComponent
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
        <div className="dropdown-content">
          {isFocused &&
            people.map(person => (
              <div
                onClick={() => handleSelectPerson(person)}
                key={person.name}
                className="dropdown-item"
                data-cy="suggestion-item"
              >
                <p className="has-text-link">{person.name}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
