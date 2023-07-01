import { Person } from '../types/Person';
import { Item } from './Item';

type Props = {
  visiblePeople: Person[],
  onClickHandler: (persone: Person) => void
};

export const List: React.FC<Props> = ({ visiblePeople, onClickHandler }) => {
  return (
    <>
      {visiblePeople.length !== 0 && (
        <div className="dropdown-content">
          <Item
            visiblePeople={visiblePeople}
            onClickHandler={onClickHandler}
          />
        </div>
      )}
    </>
  );
};
