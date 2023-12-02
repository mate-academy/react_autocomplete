import { Person } from '../../types/Person';

interface Props {
  onSelected: (person: Person) => void;
  peopleToView: Person[];
}

export function People({ peopleToView, onSelected }: Props) {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        {peopleToView.length === 0 ? (
          <div className="dropdown-item">
            <p>No matching suggestions</p>
          </div>
        ) : (
          peopleToView.map((person: Person) => (
            <div
              aria-hidden
              className="dropdown-item"
              key={person.slug}
              onClick={() => onSelected(person)}
            >
              <p className={`${person.sex === 'm' ? 'has-text-link' : 'has-text-danger'}`}>
                {person.name}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
