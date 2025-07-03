import { useEffect, useMemo, useReducer } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

type State = {
  hasFocus: boolean;
  suggestion: string;
  selectedPerson: Person | null;
  debouncedText: string;
};

type Action =
  | { type: 'SET_FOCUS'; payload: boolean }
  | { type: 'SET_SUGGESTION'; payload: string }
  | { type: 'SET_SELECTED_PERSON'; payload: Person | null }
  | { type: 'SET_DEBOUNCED_TEXT'; payload: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_FOCUS':
      return { ...state, hasFocus: action.payload };

    case 'SET_SUGGESTION':
      return { ...state, suggestion: action.payload };

    case 'SET_SELECTED_PERSON':
      return { ...state, selectedPerson: action.payload };

    case 'SET_DEBOUNCED_TEXT':
      return { ...state, debouncedText: action.payload };

    default:
      return state;
  }
};

const noSuggestions = (
  <div
    className="
      notification
      is-danger
      is-light
      mt-3
      is-align-self-flex-start
    "
    role="alert"
    data-cy="no-suggestions-message"
  >
    <p className="has-text-danger">No matching suggestions</p>
  </div>
);

export const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, {
    hasFocus: false,
    suggestion: '',
    selectedPerson: null,
    debouncedText: '',
  });

  useEffect(() => {
    const handler = window.setTimeout(() => {
      dispatch({ type: 'SET_DEBOUNCED_TEXT', payload: state.suggestion });
    }, 300);

    return () => {
      window.clearTimeout(handler);
    };
  }, [state.suggestion]);

  const handleSuggestionChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch({ type: 'SET_SUGGESTION', payload: event.target.value });
    dispatch({ type: 'SET_SELECTED_PERSON', payload: null });
  };

  const filteredPeople = useMemo(() => {
    if (!state.debouncedText.trim() && state.hasFocus) {
      return peopleFromServer;
    }

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(state.debouncedText.toLowerCase()),
    );
  }, [state.debouncedText, state.hasFocus]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {state.selectedPerson
            ? `${state.selectedPerson?.name} (${state.selectedPerson?.born} - ${state.selectedPerson?.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${state.hasFocus ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              onFocus={() => dispatch({ type: 'SET_FOCUS', payload: true })}
              onBlur={() => dispatch({ type: 'SET_FOCUS', payload: false })}
              onChange={handleSuggestionChange}
              value={state.suggestion}
              type="text"
              placeholder="Enter a part of the name"
              className="input"
              data-cy="search-input"
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            {state.hasFocus && (
              <div className="dropdown-content">
                {filteredPeople.map((person, index) => (
                  <div key={index} className="dropdown-item">
                    <button
                      onMouseDown={e => e.preventDefault()}
                      data-cy="suggestion-item"
                      className="has-text-link"
                      onClick={() => {
                        dispatch({
                          type: 'SET_SUGGESTION',
                          payload: person.name,
                        });
                        dispatch({
                          type: 'SET_SELECTED_PERSON',
                          payload: person,
                        });
                      }}
                    >
                      {person.name}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {filteredPeople.length === 0 && state.hasFocus && noSuggestions}
      </main>
    </div>
  );
};
