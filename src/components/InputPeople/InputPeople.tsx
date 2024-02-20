import React, { useEffect } from 'react';
import { Person } from '../../types/Person';

interface Props {
  query: string;
  appliedQuery: string;
  selectedPeople: Person | null;
  isListShow: boolean;
  setAppliedQuery: (string: string) => void;
  handleQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setQuery: (string: string) => void;
  setSelectedPeople: (person: Person | null) => void;
  setIsListShow: React.Dispatch<React.SetStateAction<boolean>>;
  setPageTitle: (string: string) => void;
}

export const InputPeople: React.FC<Props> = ({
  query,
  appliedQuery,
  selectedPeople,
  isListShow,
  handleQueryChange,
  setQuery,
  setAppliedQuery,
  setSelectedPeople,
  setIsListShow,
  setPageTitle,
}) => {
  const handleClick = () => {
    setIsListShow(isListShow);
  };

  const handleFocus = () => setIsListShow(true);

  const handleSelectedPeople = () => {
    return selectedPeople ? selectedPeople.name : query;
  };

  const handleInputClear = () => {
    setQuery('');
    setAppliedQuery('');
    setSelectedPeople(null);
    setPageTitle('No selected person');

    const inputElement = document.getElementById('search-input');

    if (inputElement) {
      inputElement.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace') {
      handleInputClear();
    }
  };

  const renderClearButton = () => {
    if (appliedQuery.length > 0 || selectedPeople) {
      return (
        <span className="icon is-small is-right">
          <button
            type="button"
            className="delete is-small"
            onClick={handleInputClear}
          >
            ✖️
          </button>
        </span>
      );
    }

    return null;
  };

  useEffect(() => {
    const inputElement = document.getElementById('search-input');

    if (inputElement) {
      inputElement.focus();
    }
  }, [query]);

  return (
    <div className="dropdown-trigger control has-icons-right">
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        data-cy="search-input"
        value={handleSelectedPeople()}
        onChange={handleQueryChange}
        onClick={handleClick}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
      />

      {renderClearButton()}
    </div>
  );
};
