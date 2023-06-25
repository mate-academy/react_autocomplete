import cn from 'classnames';
import { useContext } from 'react';
import { DropdownDataContext } from './DropdownData';

export const PersonsSelect = (
) => {
  const dropdownData = useContext(DropdownDataContext);

  return (
    <>
      {dropdownData?.preparedPeople.map(person => {
        const { name, sex, slug } = person;
        const isMale = sex === 'm';

        return (
          <div key={slug} className="dropdown-item">
            <a
              href={`#${slug}`}
              className={cn('dropdown-item', {
                'has-text-link': isMale,
                'has-text-danger': !isMale,
              })}
              onClick={(e) => {
                e.preventDefault();
                dropdownData.setSelectMenuVisible(false);
                dropdownData.onSelectPerson(person);
              }}
            >
              {name}
            </a>
          </div>
        );
      })}
    </>
  );
};
