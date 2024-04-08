import React from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

type State = {
  query: string;
  selectedPerson: Person | null;
  isDropedDown: boolean;
};

export class App extends React.Component {
  state: State = {
    query: '',
    selectedPerson: null,
    isDropedDown: false,
  };

  getFilterPeople = (): Person[] => {
    const { query } = this.state;

    if (!query) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(query.toLowerCase().trim()),
    );
  };

  handlerBlur = () => {
    setTimeout(() => {
      this.setState({ isDropedDown: false });
    }, 300);
  };

  handlerOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    this.setState({ query: value });

    if (!value) {
      this.setState({ selectedPerson: null });
    }
  };

  handlerClear = () => {
    this.setState({
      selectedPerson: null,
      query: '',
    });
  };

  render() {
    const { query, selectedPerson } = this.state;
    const { name, born, died } = selectedPerson || {};

    return (
      <div className="container">
        <main className="section is-flex is-flex-direction-column">
          {name ? (
            <h1 className="title" data-cy="title">
              {`${name} (${born} - ${died})`}
            </h1>
          ) : (
            <h1 className="title" data-cy="title">
              No selected person
            </h1>
          )}

          <div className="dropdown is-active">
            <div className="dropdown-trigger">
              <input
                type="text"
                placeholder="Enter a part of the name"
                className="input"
                data-cy="search-input"
                onFocus={() => this.setState({ isDropedDown: true })}
                onBlur={this.handlerBlur}
                value={query}
                onChange={this.handlerOnChange}
              />
            </div>

            <div className="control">
              <button className="button is-info" onClick={this.handlerClear}>
                Clear
              </button>
            </div>

            <div
              className="dropdown-menu custom-dropdown-menu"
              role="menu"
              data-cy="suggestions-list"
            >
              {this.state.isDropedDown &&
                this.getFilterPeople().map(person => (
                  <div
                    className="dropdown-content custom-dropdown-item"
                    key={person.name}
                    onClick={() => {
                      this.setState({
                        query: person.name,
                        isDropedDown: false,
                        selectedPerson: person,
                      });
                    }}
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
          </div>

          {this.getFilterPeople().length === 0 && (
            <div
              className="
              notification
              is-danger
              is-light
              mt-3
              is-align-self-flex-start"
              role="alert"
              data-cy="no-suggestions-message"
            >
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          )}

          {selectedPerson && this.getFilterPeople().length > 0 && (
            <div
              className="
              notification
              is-info
              is-light
              mt-3
              is-align-self-flex-start"
              role="alert"
              data-cy="no-suggestions-message"
            >
              <p className="has-text-info">Person founded</p>
            </div>
          )}
        </main>
      </div>
    );
  }
}
