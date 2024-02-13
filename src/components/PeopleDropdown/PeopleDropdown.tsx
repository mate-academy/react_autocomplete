import React, { useCallback, useRef, useState } from 'react';
import { PeopleList } from '../PeopleList';
import { Person } from '../../types/Person';
import { debounce } from '../../helpers/debounce';

interface Props {
  onQueryChange: (newQuery: string) => void,
  onPersonSelected: (selectedPerson: Person) => void,
  delay: number,
  people: Person[],
}

export const PeopleDropdown: React.FC<Props> = React.memo(
  ({
    onQueryChange,
    onPersonSelected,
    delay,
    people,
  }) => {
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [isInputTextChanged, setIsInputTextChanged] = useState(false);
    const queryInput = useRef<HTMLInputElement>(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const updateQuery = useCallback(
      debounce(onQueryChange, delay, setIsInputTextChanged),
      [onQueryChange, delay],
    );

    const onInputBlur = (
      event: React.FocusEvent<HTMLInputElement, Element>,
    ) => {
      if (!event.relatedTarget?.parentElement?.classList
        .contains('dropdown-item')
      ) {
        setIsInputFocused(false);
        onQueryChange('');
        if (queryInput.current) {
          queryInput.current.value = '';
        }
      }
    };

    return (
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            ref={queryInput}
            onFocus={() => setIsInputFocused(true)}
            onChange={(event) => {
              setIsInputTextChanged(true);
              updateQuery(event.target.value, false);
            }}
            onBlur={(event) => onInputBlur(event)}
            type="text"
            placeholder="Enter a part of the name"
            className="input"
          />
        </div>

        {isInputFocused && !isInputTextChanged
          && (
            <PeopleList people={people} onPersonSelected={onPersonSelected} />
          )}
      </div>
    );
  },
);
