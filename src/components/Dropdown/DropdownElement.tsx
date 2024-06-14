import classNames from 'classnames';
import React, { useContext } from 'react';
import { Context } from './Context';
import { DropdownTrigger } from './DropdownTrigger';
import { DropdownMenu } from './DropdownMenu';

export const DropdownElement: React.FC = () => {
  const { active } = useContext(Context);

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
