import React, { useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [filteredPerson, setFilteredPerson] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newText = event.target.value;

    setInputText(newText);

    // eslint-disable-next-line max-len
    const filtered = peopleFromServer.filter(person => person.name.toLowerCase().includes(newText.toLowerCase()));

    setFilteredPerson(filtered);
  };

  const handleSuggestionClick = (person: Person) => {
    setSelectedSlug(person.slug);
    setSelectedPerson(person);
    setInputText(person.name);
    setFilteredPerson([]);
  };

  const handleKeyDown = (event: React.KeyboardEvent, person: Person) => {
    if (event.key === 'Enter') {
      handleSuggestionClick(person);
    }
  };

  const selectedUser = peopleFromServer.find(
    person => person.slug === selectedSlug,
  );

  const isInputSameAsSelected = selectedPerson
    && selectedPerson.name.toLowerCase() === inputText.toLowerCase();

  return (
    <main className="section">
      <h1 className="title">
        {selectedUser
          ? `${selectedUser.name} (${selectedUser.born} - ${selectedUser.died})`
          : 'Unknown User'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={inputText}
            onChange={handleInputChange}
          />
        </div>

        {inputText && !isInputSameAsSelected && (
          <div
            className="dropdown-menu"
            role="menu"
          >
            <div className="dropdown-content">
              {filteredPerson.length > 0
                ? filteredPerson.map((person: Person) => (
                  <div
                    role="button"
                    className="dropdown-item"
                    tabIndex={0}
                    key={person.slug}
                    onClick={() => {
                      // eslint-disable-next-line @typescript-eslint/no-unused-expressions, no-sequences
                      setSelectedSlug(person.slug),
                      handleSuggestionClick(person);
                    }}
                    onKeyDown={event => handleKeyDown(event, person)}
                  >
                    <p
                      className={
                        selectedPerson === person ? 'has-text-link' : ''
                      }
                    >
                      {person.name}
                    </p>
                  </div>
                ))
                : (
                  // Відображати тільки при введеному тексті
                  <div className="dropdown-item">
                    <p className="has-text-link">No matching suggestions</p>
                  </div>
                )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
