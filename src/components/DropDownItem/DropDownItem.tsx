import classNames from 'classnames';
import { PersonType } from '../../types/PersonType';

type Props = {
  item: PersonType;
  onSelect: (person: PersonType) => void;
};

export const DropDownItem: React.FC<Props> = ({ item: person, onSelect }) => (
  <p
    className={classNames({
      'has-text-link': person.sex === 'm',
      'has-text-danger': person.sex === 'f',
    })}
    aria-hidden="true"
    onClick={() => onSelect(person)}
  >
    {person.name}
  </p>
);
