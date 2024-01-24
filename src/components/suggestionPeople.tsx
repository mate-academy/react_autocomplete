import { FC } from 'react';
import cn from 'classnames';
import { Person } from '../types/Person';

interface SuggestionPeopleProps {
  suggestedPeople: Person[],
  onSelected: (person: Person) => void,
}

export const SuggestionPeople
: FC<SuggestionPeopleProps> = ({ suggestedPeople, onSelected }) => {
  const hander = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => {
    event.preventDefault();
    onSelected(person);
  };

  return (
    <div className="dropdown-menu" role="menu">
      {suggestedPeople.length === 0
        ? ('No matching suggestions')
        : (
          <div className="dropdown-content">
            {suggestedPeople.map(person => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
              <div
                key={person.slug}
                className="dropdown-item"
              >
                <a
                  href="/"
                  className={cn(
                    {
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    },
                  )}
                  onClick={(event) => hander(event, person)}
                >
                  {person.name}
                </a>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};
