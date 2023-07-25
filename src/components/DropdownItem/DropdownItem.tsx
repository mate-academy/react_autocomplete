import React from 'react';
import { Person } from '../../types/Person';

type Props = {
  person: Person | null;
  setPerson: (pesron: Person | null) => void;
  setFocusedInput: (v: boolean) => void;
};

export const DropdownItem: React.FC<Props> = ({
  person,
  setPerson,
  setFocusedInput,
}) => {
  const onPersonChange = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setPerson(person);
    setFocusedInput(false);
  };

  return (
    // eslint-disable-next-line react/jsx-filename-extension, jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/anchor-is-valid
    <a
      href="#"
      className="dropdown-item has-text-link"
      onClick={onPersonChange}
    >
      {person && person.name}
    </a>
  );
};
