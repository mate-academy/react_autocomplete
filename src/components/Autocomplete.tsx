/* eslint-disable @typescript-eslint/indent */
import React, { useState, useEffect } from 'react';
import { Person } from '../types/Person';

interface AutocompleteProps {
  people: Person[];
  onSelected: (person: Person | null) => void;
  debounceTime?: number;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
  people,
  onSelected,
  debounceTime = 300,
}) => {
  const [query, setQuery] = useState('');
  const [filteredPeople, setFilteredPeople] = useState<Person[]>(people);
  const [showDropdown, setShowDropdown] = useState(false);
  const [lastSearched, setLastSearched] = useState('');

  useEffect(() => {
    if (query === lastSearched) {
      return;
    }

    const handler = setTimeout(() => {
      if (query.trim() === '') {
        setFilteredPeople(people);
      } else {
        setFilteredPeople(
          people.filter(person =>
            person.name.toLowerCase().includes(query.toLowerCase()),
          ),
        );
      }

      setLastSearched(query);
    }, debounceTime);

    return () => clearTimeout(handler);
  }, [query, people, debounceTime, lastSearched]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setQuery(value);
    setShowDropdown(true);
    onSelected(null);
  };

  const handleSelect = (person: Person) => {
    setQuery(person.name);
    setShowDropdown(false);
    onSelected(person);
  };

  return React.createElement(
    'div',
    { className: `dropdown ${showDropdown ? 'is-active' : ''}` },
    React.createElement(
      'div',
      { className: 'dropdown-trigger' },
      React.createElement('input', {
        type: 'text',
        placeholder: 'Enter a part of the name',
        className: 'input',
        'data-cy': 'search-input',
        value: query,
        onChange: handleInputChange,
        onFocus: () => setShowDropdown(true),
        onBlur: () => setTimeout(() => setShowDropdown(false), 200),
      }),
    ),
    showDropdown
      ? React.createElement(
          'div',
          {
            className: 'dropdown-menu',
            role: 'menu',
            'data-cy': 'suggestions-list',
          },
          React.createElement(
            'div',
            { className: 'dropdown-content' },
            filteredPeople.length > 0
              ? filteredPeople.map(person =>
                  React.createElement(
                    'div',
                    {
                      key: person.slug,
                      className: 'dropdown-item',
                      'data-cy': 'suggestion-item',
                      onMouseDown: () => handleSelect(person),
                    },
                    React.createElement(
                      'p',
                      { className: 'has-text-link' },
                      person.name,
                    ),
                  ),
                )
              : React.createElement(
                  'div',
                  {
                    className: 'dropdown-item',
                    'data-cy': 'no-suggestions-message',
                  },
                  React.createElement(
                    'p',
                    { className: 'has-text-danger' },
                    'No matching suggestions',
                  ),
                ),
          ),
        )
      : null,
  );
};
