import React, { useState, useCallback } from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { peopleFromServer } from '../data/people';
import { DropdownList } from './DropdownList';
import { Person } from '../types/Person';

type Props = {
  delay: number,
  person?: Person | null,
  onSelect: (person: Person | null) => void,
};

export const DropdownInput: React.FC<Props> = ({ onSelect, delay, person }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [query, setQuery] = useState('');
  const [isListHovered, setIsListHovered] = useState(false);
  const [curentValue, setCurrentValue] = useState('');

  const applyQuery = useCallback(debounce(setQuery, delay), []);
  const applyTypingState = useCallback(debounce(setIsTyping, delay), []);

  const filteredPeople = peopleFromServer
    .filter(pers => (
      pers.name.toLocaleLowerCase().includes(query.toLowerCase())
    ));

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(event.target.value);
    applyQuery(event.target.value);
    applyTypingState(false);
    onSelect(null);
  };

  const handleBlur = () => (
    isListHovered ? setIsFocused(true) : setIsFocused(false)
  );

  return (
    <div
      className={classNames('dropdown', {
        'is-active': (isFocused && !isTyping && !person),
      })}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          className="input"
          value={curentValue}
          placeholder="Enter a part of the name"
          onKeyDown={() => setIsTyping(true)}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          onChange={handleQueryChange}
        />
      </div>

      <DropdownList
        onSelect={onSelect}
        onPersonSelect={setCurrentValue}
        onHover={(val: boolean) => setIsListHovered(val)}
        people={filteredPeople}
      />
    </div>
  );
};
