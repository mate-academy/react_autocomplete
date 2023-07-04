import { FC, memo, useState } from 'react';
import classNames from 'classnames';
import { Person } from '../types/Person';
import { DropdownMenu } from './DropdownMenu';
import { DropdownInput } from './DropdownInput';

type Props = {
  applyQuery: (value: string) => void;
  setSelectedPerson: (person: Person) => void;
  visiblePersons: Person[] | null;
};

export const Dropdown: FC<Props> = memo(({
  applyQuery,
  setSelectedPerson,
  visiblePersons,
}) => {
  const [showSuggestions, setShowSuggestions] = useState<boolean>(true);

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

        {visiblePersons
        && (
          <DropdownMenu
            setSelectedPerson={setSelectedPerson}
            setShowSuggestions={setShowSuggestions}
            visiblePersons={visiblePersons}
          />
        )}
      </div>
    </div>
  );
});
