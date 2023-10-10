/* eslint-disable no-console */
import React, {
  useContext, useState, useCallback,
} from 'react';
import debounce from 'lodash/debounce';
import {
  AutocompleteStateContext,
} from './AutocompleteContext';

import { Person } from '../../types/Person';

interface AutocompleteProps {
  debounceDelay: number;
  onSelected: (person: Person) => void;
}

export const Autocomplete: React.FC<AutocompleteProps>
  = React.memo(({ debounceDelay, onSelected }) => {
    const { suggestions } = useContext(AutocompleteStateContext);

    const [
      displayedSuggestions,
      setDisplayedSuggestions,
    ] = useState(suggestions);
    const [inputText, setInputText] = useState('');

    const filterSuggestions = useCallback((text: string) => {
      const filteredSuggestions = suggestions.filter(
        person => person.name.toLowerCase().includes(text.toLowerCase()),
      );

      setDisplayedSuggestions(filteredSuggestions);
    }, [suggestions]);

    const debouncedFilterSuggestions = useCallback(debounce(
      filterSuggestions, debounceDelay,
    ),
    [filterSuggestions, debounceDelay]);

    const handleInputChange = (value: string) => {
      setInputText(value);
      debouncedFilterSuggestions(value);
    };

    // #region State tracking

    // useEffect(() => {
    //   console.log('suggestions from context changed', suggestions);
    // }, [suggestions]);

    // useEffect(() => {
    //   console.log('originalSuggestions state changed', originalSuggestions);
    // }, [originalSuggestions]);

    // useEffect(() => {
    //   console.log('displayedSuggestions state changed', displayedSuggestions);
    // }, [displayedSuggestions]);

    // useEffect(() => {
    //   console.log('inputText state changed', inputText);
    // }, [inputText]);

    // #endregion

    console.log('Rendering AutoComplete');

    return (
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={inputText}
            onChange={(e) => handleInputChange(e.target.value)}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {displayedSuggestions.length > 0 ? (
              displayedSuggestions.map((person) => (
                <button
                  className="dropdown-item"
                  type="button"
                  key={person.slug}
                  onClick={() => onSelected(person)}
                >
                  <p className={person.sex === 'm'
                    ? 'has-text-link'
                    : 'has-text-danger'}
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
      </div>
    );
  });
