import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import debounce from 'lodash.debounce';
import { Person } from './types/Person';
import { DropdownMenu } from './components/DropdownMenu/DropdownMenu';
import { Dropdown } from './components/Dropdown/Dropdown';

type Props = {
  debounceDelay: number;
};

export const App: React.FC<Props> = ({ debounceDelay = 300 }) => {
  const [peoples] = useState(peopleFromServer);
  const [selectPeople, setSelectPeople] = useState<Person | null>(null);

  const [inputValue, setInputValue] = useState('');
  const [appliedInputValue, setAppliedInputValue] = useState('');
  const previousInputValue = useRef('');

  const [noMatchingSuggestions, setNoMatchingSuggestions] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  const { name, born, died } = selectPeople || {};

  const appliedInput = useRef(
    debounce((value: string) => {
      if (value !== previousInputValue.current) {
        setAppliedInputValue(value);
        previousInputValue.current = value;
      }
    }, debounceDelay),
  ).current;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    appliedInput(event.target.value);

    if (selectPeople) {
      setSelectPeople(null);
    }
  };

  const filteredPeople = useMemo(() => {
    if (!appliedInputValue.trim()) {
      return peoples;
    }

    const newPeople = peoples.filter(person =>
      person.name.toLowerCase().includes(appliedInputValue.toLowerCase()),
    );

    return newPeople;
  }, [peoples, appliedInputValue]);

  useEffect(() => {
    setNoMatchingSuggestions(filteredPeople.length < 1);
  }, [filteredPeople]);

  useEffect(() => {
    return () => {
      appliedInput.cancel();
    };
  }, [appliedInput]);

  const handleSelectPerson = (people: Person) => {
    setSelectPeople(people);
    setInputValue(`${people.name}`);
    setAppliedInputValue(people.name);
    previousInputValue.current = people.name;
    setIsFocus(true);
  };

  const shouldShowContent = isFocus && !noMatchingSuggestions && !selectPeople;

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectPeople ? `${name} (${born} - ${died})` : 'No selected person'}
        </h1>

        <div className="dropdown is-active">
          <Dropdown
            inputValue={inputValue}
            setIsFocus={setIsFocus}
            handleInputChange={handleInputChange}
          />

          <DropdownMenu
            handleSelectPerson={handleSelectPerson}
            shouldShowContent={shouldShowContent}
            filteredPeople={filteredPeople}
          />
        </div>

        {noMatchingSuggestions && (
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
        )}
      </main>
    </div>
  );
};
