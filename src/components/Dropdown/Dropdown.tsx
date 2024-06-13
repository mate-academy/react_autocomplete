import { useState } from 'react';
import { Person } from '../../types/Person';
import { DropdownMenu } from './DropdownMenu';
import { DropdownTrigger } from './DropdownTrigger';
import classNames from 'classnames';

type Props = {
  people: Person[];
  delay?: number;
  onNoMatch: (noMatch: boolean) => void;
};

export const Dropdown: React.FC<Props> = ({
  people,
  delay = 300,
  onNoMatch,
}) => {
  const [active, setActive] = useState(false);
  const [filteredPeople, setFilteredPeople] = useState(people);

  const onTrigger = function (activate: boolean) {
    setActive(activate);
  };

  const onFilter = function (partOfName: string) {
    const newFilteredPeople = people.filter(person =>
      person.name.toLowerCase().includes(partOfName.toLowerCase()),
    );

    setFilteredPeople(newFilteredPeople);
    onNoMatch(!newFilteredPeople.length);
  };

  return (
    <div
      className={classNames('dropdown', {
        'is-active': active,
      })}
    >
      <DropdownTrigger
        delay={delay}
        onTrigger={onTrigger}
        onFilter={onFilter}
      />
      <DropdownMenu people={filteredPeople} />
    </div>
  );
};
