import React, { useState, useMemo } from 'react';
import './App.scss';
import { debounce } from 'lodash';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

const Autocomplete: React.FC<{
  delay: number;
  people: Person[];
  onSelected: (person: Person | null) => void;
}> = ({ delay, people, onSelected }) => {
  const [text, setText] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [isShowList, setIsShowList] = useState<boolean>(false);

  const filterPeopleWithDelay = useMemo(() => {
    return debounce((input: string) => {
      const filteredPeople = people.filter((person) => (
        person.name.toLowerCase().includes(input.toLowerCase())
      ));

      setIsShowList(true);
      setSuggestions(filteredPeople);
    }, delay);
  }, [people, delay]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    setIsShowList(false);
    setText(input);
    filterPeopleWithDelay(input);
  };

  const handleInputFocus = () => {
    setIsShowList(true);
    if (text === '') {
      setSuggestions(people);
    }
  };

  const handleSuggestionClick = (
    person: Person,
  ) => {
    setText(person.name);
    setSuggestions([person]);
    onSelected(person);
    setIsShowList(false);
  };

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value.length || !text.length) {
      setIsShowList(false);
    }

    const input = e.target.value;

    setText(input);
    filterPeopleWithDelay(input);
  };

  return (
    <div
      className="dropdown is-active"
    >
      <div
        className="dropdown-trigger"
      >
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          onFocus={handleInputFocus}
          onChange={handleInputChange}
          value={text}
          onBlur={(e) => handleBlur(e)}
        />
      </div>

      <div
        className="dropdown-menu"
        role="menu"
      >
        {isShowList && (
          <div className="dropdown-content">
            {suggestions.length === 0 ? (
              <div className="dropdown-item">No matching suggestions</div>
            ) : (
              suggestions.map((person) => (
                <button
                  type="button"
                  className="dropdown-item"
                  key={person.slug}
                  onFocus={handleInputFocus}
                  onClick={() => {
                    handleSuggestionClick(person);
                  }}
                >
                  <p>
                    {person.name}

                  </p>
                </button>
              )))}
          </div>
        )}
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>
      <Autocomplete
        delay={1000}
        people={peopleFromServer}
        onSelected={(person) => setSelectedPerson(person)}
      />
    </main>
  );
};
