import { Person } from '../../types/Person';

type Props = {
  people: Person[]
};

export const Dropdown = ({ people }: Props) => {
  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          <div className="dropdown-item">
            <p className="has-text-link">Pieter Haverbeke</p>
          </div>
          {people.map(person => (
            <div className="dropdown-item">
              <p className="has-text-link">{person.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
