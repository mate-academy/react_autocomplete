import React from 'react';

import { Person } from '../../types/Person';

type Props = {
  people: Person[];
  onPersonClick: (person: Person) => void;
  isDroped: boolean;
};

export class PersonList extends React.Component<Props> {
  render() {
    const { people, onPersonClick, isDroped } = this.props;

    if (!isDroped) {
      return null;
    }

    return (
      <div
        className="dropdown-menu custom-dropdown-menu"
        role="menu"
        data-cy="suggestions-list"
      >
        {isDroped &&
          people.map(person => (
            <div
              className="dropdown-content custom-dropdown-item"
              key={person.name}
              onClick={() => onPersonClick(person)}
              style={{
                cursor: 'pointer',
              }}
            >
              <div className="dropdown-item" data-cy="suggestion-item">
                <p className="has-text-link">{person.name}</p>
              </div>
            </div>
          ))}
      </div>
    );
  }
}
