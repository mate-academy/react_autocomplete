import classNames from 'classnames';
import React from 'react';
import { useDropdown } from './Context';
import { DropdownTrigger } from './DropdownTrigger';
import { DropdownMenu } from './DropdownMenu';

export const DropdownElement: React.FC = () => {
  const { active } = useDropdown();

  return (
    <div
      className={classNames('dropdown', {
        'is-active': active,
      })}
    >
      <DropdownTrigger />
      <DropdownMenu />
    </div>
  );
};
