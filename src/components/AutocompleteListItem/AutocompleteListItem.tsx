import { memo } from 'react';
import classNames from 'classnames';
import { Person } from '../../types/Person';

interface Props {
  person: Person;
  onSelected: (person: Person) => void;
}

export const AutocompleteListItem = memo(({ person, onSelected }: Props) => {
  const { name, sex } = person;

  return (
    <div
      className="dropdown-item is-clickable"
      data-cy="suggestion-item"
      onMouseDown={() => onSelected(person)}
    >
      <p
        className={classNames({
          'has-text-link': sex === 'm',
          'has-text-danger': sex === 'f',
        })}
      >
        {name}
      </p>
    </div>
  );
});

AutocompleteListItem.displayName = 'AutocompleteListItem';
