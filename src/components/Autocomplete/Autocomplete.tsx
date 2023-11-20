import React, {
  useContext, useCallback,
} from 'react';
import debounce from 'lodash/debounce';
import classNames from 'classnames';

import {
  AutocompleteActions,
  AutocompleteDispatchContext,
  AutocompleteStateContext,
} from './AutocompleteContext';

import { Person } from '../../types/Person';

interface AutocompleteProps {
  debounceDelay: number;
}

export const Autocomplete: React.FC<AutocompleteProps>
  = React.memo(({ debounceDelay }) => {
    const dispatch = useContext(AutocompleteDispatchContext);
    const {
      suggestions,
      displayedSuggestions,
      inputText,
      isFocused,
    } = useContext(AutocompleteStateContext);

    const filterSuggestions = useCallback((text: string) => {
      const filteredSuggestions = suggestions.filter(
        person => person.name.toLowerCase().includes(text.toLowerCase()),
      );

      dispatch({
        type: AutocompleteActions.UpdateDisplayedSuggestions,
        payload: filteredSuggestions,
      });
    }, [suggestions, dispatch]);

    const debouncedFilterSuggestions = useCallback(debounce(
      filterSuggestions, debounceDelay,
    ),
    [filterSuggestions, debounceDelay]);

    const handleInputFocus = () => {
      dispatch({
        type: AutocompleteActions.UpdateIsFocused,
        payload: true,
      });
    };

    const handleInputBlur = () => {
      setTimeout(() => {
        dispatch({
          type: AutocompleteActions.UpdateIsFocused,
          payload: false,
        });
      }, 150);
    };

    const handleInputChange = (value: string) => {
      dispatch({
        type: AutocompleteActions.UpdateText,
        payload: value,
      });
      debouncedFilterSuggestions(value);
    };

    const handlePersonSelected = (person: Person) => {
      dispatch({
        type: AutocompleteActions.UpdateText,
        payload: person.name,
      });
      dispatch({
        type: AutocompleteActions.SelectPerson,
        payload: person,
      });
    };

    return (
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={inputText}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />
        </div>

        {isFocused && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {displayedSuggestions.length > 0 ? (
                displayedSuggestions.map((person) => (
                  <button
                    className="dropdown-item"
                    type="button"
                    key={person.slug}
                    onClick={() => handlePersonSelected(person)}
                  >
                    <p className={classNames({
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex !== 'm',
                    })}
                    >
                      {person.name}
                    </p>
                  </button>
                ))
              ) : (
                <div className="dropdown-item">
                  <p>No matching suggestions</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    );
  });
