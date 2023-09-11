import { Person } from '../../types/Person';
import { DropDownItem } from '../DropDownItem/DropDowItem';

type Props = {
  people: Person[],
  hasFocus: boolean,
  onSelectedPerson: (personSlug: Person) => void,
  isLoading: boolean
};

export const DropDownMenu: React.FC<Props> = ({
  people,
  hasFocus,
  onSelectedPerson,
  isLoading,
}) => {
  let content;

  if (!isLoading) {
    if (people.length) {
      content = (
        <div>
          {people.map(person => (
            <DropDownItem
              key={person.slug}
              person={person}
              onSelectedPerson={onSelectedPerson}
            />
          ))}
        </div>
      );
    } else {
      content = <p>No matching suggestions</p>;
    }
  } else {
    content = <p>Loading</p>;
  }

  return (
    <div className="dropdown-menu" role="menu">
      {hasFocus && (
        <div className="dropdown-content">
          {content}
        </div>
      )}

    </div>
  );
};
