import React from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { PersonList } from './data/components/PersonList';

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

  handlerOnBlur = () => {
    setTimeout(() => {
      this.setState({ isDropedDown: false });
    }, 100);
  };

  handlerOnFocus = () => {
    this.setState({ isDropedDown: true });
  };

  handlerOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    this.setState({ query: value.trimStart() });

    if (value.length < this.state.query.length) {
      this.setState({ selectedPerson: null });
    }
  };

  handlerOnClick = (person: Person) => {
    this.setState({
      query: person.name,
      isDropedDown: false,
      selectedPerson: person,
    });
  };

  handlerOnClear = () => {
    this.setState({
      selectedPerson: null,
      query: '',
    });
  };

  render() {
    const { query, selectedPerson } = this.state;
    const { name, born, died } = selectedPerson || {};
    const filteredPeople = this.getFilterPeople();

    return (
      <div className="container">
        <main className="section is-flex is-flex-direction-column">
          <h1 className="title" data-cy="title">
            {selectedPerson
              ? `${name} (${born} - ${died})`
              : 'No selected person'}
          </h1>

          <div className="dropdown is-active">
            <div className="dropdown-trigger">
              <input
                type="text"
                placeholder="Enter a part of the name"
                className="input"
                data-cy="search-input"
                onFocus={this.handlerOnFocus}
                onBlur={this.handlerOnBlur}
                value={query}
                onChange={this.handlerOnChange}
              />
            </div>

            <div className="control">
              <button className="button is-info" onClick={this.handlerOnClear}>
                Clear
              </button>
            </div>
            <PersonList
              people={filteredPeople}
              onPersonClick={this.handlerOnClick}
              isDroped={this.state.isDropedDown}
            />
          </div>

          {filteredPeople.length === 0 && (
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

          {selectedPerson && filteredPeople.length > 0 && (
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
