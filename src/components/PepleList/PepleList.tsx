import React from 'react';
import { PepleInfo } from '../PepleInfo/PepleInfo';
import { Person } from '../../types/Person';

interface Props {
  people: Person[];
  filterpeople?: (value: string) => void;
  searchByName?: boolean;
}

export const PepleList: React.FC<Props> = ({
  people,
  filterpeople = () => {},
  searchByName = false,
}) => (
  <div className="dropdown is-active">
    <div className="dropdown-trigger">
      <button
        className="button"
        aria-haspopup="true"
        aria-controls="dropdown-menu"
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            onChange={event => filterpeople(event.target.value)}
          />
        </div>
        <span className="icon is-small">
          <i className="fas fa-angle-down" aria-hidden="true"></i>
        </span>
      </button>
    </div>
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {searchByName && (
          <>
            {people.map(person => (
              <PepleInfo pesron={person} key={person.name} />
            ))}
          </>
        )}
      </div>
    </div>
  </div>
);
