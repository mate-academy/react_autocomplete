import { FC, MouseEvent } from 'react';
import { Person } from '../../types/Person';
import { DropDownItem } from '../DropDownItem/DropDownItem';

interface Props {
  visiblePeoples: Person[];
  selectedSlug: string;
  onSelectPerson: (
    event: MouseEvent,
    person: Person
  ) => void;
}

export const DropDownContent: FC<Props> = ({
  visiblePeoples,
  selectedSlug,
  onSelectPerson,
}) => {
  return (
    <div className="dropdown-content">
      {visiblePeoples.length
        ? (
          <>
            {visiblePeoples.map(person => (
              <DropDownItem
                key={person.slug}
                person={person}
                selectedSlug={selectedSlug}
                onSelectPerson={onSelectPerson}
              />
            ))}
          </>
        )
        : (
          <span>No matching suggestions</span>
        )}
    </div>
  );
};
