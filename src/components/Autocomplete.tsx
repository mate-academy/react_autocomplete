import React, {
  useState,
  useMemo,
} from 'react';
import { debounce } from 'lodash';
import { Person } from '../types/Person';

const DEFAULT_PERSON: Person = {
  name: '',
  sex: null,
  born: 0,
  died: 0,
  fatherName: null,
  motherName: null,
  slug: '',
};

export const Autocomplete: React.FC<{
  delay: number;
  people: Person[];
  onSelected: (person: Person | null) => void;
}> = ({ delay, people, onSelected }) => {
  const [text, setText] = useState<string>('');
  const [memoryPerson, setMemoryPerson] = useState<Person>(DEFAULT_PERSON);
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [isShowList, setIsShowList] = useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const filterPeopleWithDelay = useMemo(() => {
    return debounce((input: string) => {
      const filteredPeople = people.filter((person) => (
        person.name.toLowerCase().includes(input.toLowerCase())
      ));

      setIsShowList(true);
      setSuggestions(filteredPeople);
    }, delay);
  }, [people, delay]);

  const handleInputFocus = () => {
    setIsShowList(true);
    setIsFirstLoad(false);
    if (text === '') {
      setSuggestions(people);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    setIsShowList(false);
    if (!input.length) {
      setText(memoryPerson.name);
    }

    setText(input);
    filterPeopleWithDelay(input);
  };

  const handleSuggestionClick = (person: Person) => {
    setText(person.name);
    setSuggestions([person]);
    onSelected(person);
    setIsShowList(false);
    setIsFirstLoad(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const relatedTarget = e.relatedTarget as Element;

    if (!relatedTarget || !relatedTarget.closest('.dropdown')) {
      setIsShowList(false);

      if (memoryPerson.name.length) {
        setText(memoryPerson.name);
        onSelected(memoryPerson);
      }
    }
  };

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
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

      <div className="dropdown-menu" role="menu">
        {!isFirstLoad && isShowList && (
          <div className="dropdown-content">
            {suggestions.length === 0 ? (
              <div className="dropdown-item">No matching suggestions</div>
            ) : (
              suggestions.map((person) => (
                <button
                  type="button"
                  className="dropdown-item"
                  key={person.slug}
                  onMouseEnter={() => {
                    setMemoryPerson(person);
                  }}
                  onClick={() => {
                    handleSuggestionClick(person);
                  }}
                  onMouseLeave={() => {
                    setMemoryPerson(DEFAULT_PERSON);
                  }}
                >
                  <p>{person.name}</p>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
