import React from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';

export const App: React.FC = () => {
  const { name, born, died } = peopleFromServer[0];

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-qa="title">
          {`${name} (${born} - ${died})`}
        </h1>

        <div className="dropdown is-active">
          <div className="dropdown-trigger">
            <input
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-qa="search-input"
            />
          </div>

          <div
            className="dropdown-menu"
            role="menu"
            data-qa="suggestions-list"
          >
            <div className="dropdown-content">
              <div
                className="dropdown-item"
                data-qa="suggestion-item"
              >
                <p className="has-text-link">Pieter Haverbeke</p>
              </div>

              <div
                className="dropdown-item"
                data-qa="suggestion-item"
              >
                <p className="has-text-link">Pieter Bernard Haverbeke</p>
              </div>

              <div
                className="dropdown-item"
                data-qa="suggestion-item"
              >
                <p className="has-text-link">Pieter Antone Haverbeke</p>
              </div>

              <div
                className="dropdown-item"
                data-qa="suggestion-item"
              >
                <p className="has-text-danger">Elisabeth Haverbeke</p>
              </div>

              <div
                className="dropdown-item"
                data-qa="suggestion-item"
              >
                <p className="has-text-link">Pieter de Decker</p>
              </div>

              <div
                className="dropdown-item"
                data-qa="suggestion-item"
              >
                <p className="has-text-danger">Petronella de Decker</p>
              </div>

              <div
                className="dropdown-item"
                data-qa="suggestion-item"
              >
                <p className="has-text-danger">Elisabeth Hercke</p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="
            notification
            is-danger
            is-light
            mt-3
            is-align-self-flex-start
          "
          role="alert"
          data-qa="no-suggestions-message"
        >
          <p className="has-text-danger">No matching suggestions</p>
        </div>
      </main>
    </div>
  );
};
