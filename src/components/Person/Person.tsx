import React from 'react';
import cn from 'classnames';

import { Person } from '../../types/Person';

type Props = {
  person: Person;
  onSelected: React.Dispatch<React.SetStateAction<string>>;
  isVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

export const PersonInfo:React.FC<Props> = ({
  person,
  onSelected,
  isVisible,
}) => {
  const { name, sex, slug } = person;

  return (
    <div className="dropdown-item">
      <a
        href={`#${slug}`}
        className={cn(
          { 'has-text-link': sex === 'm' }, { 'has-text-danger': sex === 'f' },
        )}
        onClick={(event) => {
          event.preventDefault();
          onSelected(slug);
          isVisible(false);
        }}
      >
        {name}
      </a>
    </div>
  );
};
