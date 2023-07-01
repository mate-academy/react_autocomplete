import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  visiblePeople: Person[],
  onClickHandler: (persone: Person) => void
};

export const Item: React.FC<Props> = ({ visiblePeople, onClickHandler }) => {
  return (
    <>
      {visiblePeople.map((el: Person) => (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
          key={el.name}
          className="dropdown-item"
          onClick={() => onClickHandler(el)}
        >
          <p
            className={classNames({
              'has-text-link': el.sex === 'm',
              'has-text-danger': el.sex === 'f',
              'has-text-grey-light': el.sex === 'no',
            })}
          >
            {el.name}
          </p>
        </div>
      ))}
    </>
  );
};
