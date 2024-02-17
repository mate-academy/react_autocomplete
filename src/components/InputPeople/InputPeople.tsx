import React, { useEffect } from 'react';
import { Person } from '../../types/Person';

interface Props {
  query: string;
  appliedQuery: string;
  setAppliedQuery: (string: string) => void;
  handleQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setQuery: (string: string) => void;
  selectedPeople: Person | null;
  setSelectedPeople: (person: Person | null) => void;
  // onFocus: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
  showList: boolean;
  setShowList: React.Dispatch<React.SetStateAction<boolean>>;
  setPageTitle: (string: string) => void;
}

export const InputPeople: React.FC<Props> = ({
  query,
  appliedQuery,
  handleQueryChange,
  setQuery,
  setAppliedQuery,
  selectedPeople,
  setSelectedPeople,
  showList,
  setShowList,
  setPageTitle,
}) => {
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

  useEffect(() => {
    const inputElement = document.getElementById('search-input');

    if (inputElement) {
      inputElement.focus();
    }
  }, [query]);

  return (
    <div className="dropdown-trigger  control has-icons-right">
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        data-cy="search-input"
        value={handleSelectedPeople()}
        onChange={handleQueryChange}
        onClick={() => setShowList(showList)}
        onFocus={() => setShowList(true)}
        onKeyDown={handleKeyDown}
      />

      {(appliedQuery.length > 0 || selectedPeople) && (
        <span className="icon is-small is-right">
          <button
            type="button"
            className="delete is-small"
            onClick={handleInputClear}
          >
            ✖️
          </button>
        </span>
      )}
    </div>
  );
};
