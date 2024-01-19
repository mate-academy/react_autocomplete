import React from 'react';

interface Props {
  onSelected: (value: boolean) => void;
}

export const PeopleMenu: React.FC<Props> = ({ onSelected }) => {
  return (
    <div className="dropdown-menu" role="menu">
      <div className="dropdown-content">
        <div className="dropdown-item">
          <p className="has-text-link">Pieter Haverbeke</p>
        </div>

        <div className="dropdown-item">
          <p className="has-text-link">Pieter Bernard Haverbeke</p>
        </div>

        <div className="dropdown-item">
          <p className="has-text-link">Pieter Antone Haverbeke</p>
        </div>

        <div className="dropdown-item">
          <p className="has-text-danger">Elisabeth Haverbeke</p>
        </div>

        <div className="dropdown-item">
          <p className="has-text-link">Pieter de Decker</p>
        </div>

        <div className="dropdown-item">
          <p className="has-text-danger">Petronella de Decker</p>
        </div>

        <div className="dropdown-item">
          <p className="has-text-danger">Elisabeth Hercke</p>
        </div>
      </div>
    </div>
  );
};
