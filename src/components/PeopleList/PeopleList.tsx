import classNames from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  human: Person;
  humanApplied: (person: Person) => void;
};

export const PeopleList: React.FC<Props> = ({
  human: { name, slug, ...data },
  humanApplied,
}) => {
  return (
    <div
      className="dropdown-item"
      data-cy="suggestion-item"
      key={slug}
      onClick={() => humanApplied({ name, slug, ...data })}
    >
      <p
        className={classNames({
          'has-text-link': true,
          'has-text-danger': false,
        })}
      >
        {name}
      </p>
    </div>
  );
};
