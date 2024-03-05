import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { Dropdown } from './components/drobdown-menu';

export const App: React.FC = React.memo(() => {
  const [inputValue, setInputValue] = useState('');
  const [isDrobdoun, setIsDrobdoun] = useState(false);
  const [selectedName, setSelectedName] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFilter = useCallback(
    debounce((value: string) => {
      setInputValue(value);
    }, 300),
    [inputValue],
  );

  const handleName: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void = event => {
    setInputValue(event.target.value);
    setSelectedName('');
    const { value } = event.target;

    debouncedFilter(value);
  };

  const handleSelect = (event: React.MouseEvent<HTMLDivElement>) => {
    const newSelectedName = (event.target as HTMLDivElement).innerText;

    setSelectedName(newSelectedName);
    setInputValue(newSelectedName);
    setIsDrobdoun(false);
  };

  const handleKeyboard: (
    event: React.KeyboardEvent<HTMLDivElement>,
  ) => void = event => {
    if (event.key === 'Enter' || event.key === ' ') {
      setIsDrobdoun(false);
    }
  };

  // const { name, born, died } = peopleFromServer[0]

  const selectedUser =
    peopleFromServer.find(person => person.name === selectedName) || null;

  const clickDrobdoun = () => {
    setIsDrobdoun(prev => !prev);
  };

  const filtredName = useMemo(() => {
    return peopleFromServer.filter(names =>
      names.name.toLowerCase().includes(inputValue.toLowerCase()),
    );
  }, [inputValue]);

  const usersTitle: string = selectedUser
    ? `${selectedUser.name} (${selectedUser.born} - ${selectedUser.died})`
    : '';

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedUser ? usersTitle : 'No selected person'}
        </h1>
        <Dropdown
          clickDrobdoun={clickDrobdoun}
          handleKeyboard={handleKeyboard}
          handleSelect={handleSelect}
          handleName={handleName}
          isDrobdoun={isDrobdoun}
          inputValue={inputValue}
          filtredName={filtredName}
        />
        {filtredName.length === 0 && (
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
});
