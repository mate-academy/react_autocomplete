import { useContext } from 'react';
import { Person as PersonType } from '../../types/Person';
import { PersonContext } from '../../context/PersonContext';
import './Person.scss';

type Props = {
  person: PersonType,
};

export const Person: React.FC<Props> = ({ person }) => {
  const handleClick = useContext(PersonContext);

  return (
    <div
      className="dropdown-item"
      data-cy="suggestion-item"
    >
      <button
        type="button"
        className={`
          person__btn
          has-text-${person.sex === 'f' ? 'danger' : 'link'}
        `}
        onClick={() => handleClick && handleClick(person)}
      >
        <p>{person.name}</p>
      </button>
    </div>
  );
};
