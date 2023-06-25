import React, { FC, memo, useState } from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';
import { DropdownMenu } from './DropdownMenu';
import { DropdownInput } from './DropdownInput';

type SetQuaryFunc = (value: string) => void;

type Props = {
  applyQuery: SetQuaryFunc;
  setSelectedPerson: (person: Person) => void
  visiblePersones: Person[] | null;
};

export const Dropdown: FC<Props> = memo(({
  applyQuery,
  setSelectedPerson,
  visiblePersones,
}) => {
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  return (
    <div
      className={classNames('dropdown', {
        'is-active': showSuggestions,
      })}
    >
      <div className="dropdown-trigger">
        <DropdownInput
          applyQuery={applyQuery}
          setShowSuggestions={setShowSuggestions}
        />

        <DropdownMenu
          setSelectedPerson={setSelectedPerson}
          setShowSuggestions={setShowSuggestions}
          visiblePersones={visiblePersones}
        />
      </div>
    </div>
  );
});
