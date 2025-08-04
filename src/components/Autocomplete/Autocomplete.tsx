import classNames from 'classnames';
import { Person } from '../../types/Person';

type Props = {
  handleFocusInput: (event: React.FocusEvent<HTMLInputElement>) => void;
  handleQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  query: string;
  suggestions: Person[];
  setSuggestions: React.Dispatch<React.SetStateAction<Person[]>>;
  setSelected: React.Dispatch<React.SetStateAction<Person | null>>;
  dropDown: boolean;
};

export const Autocomplete: React.FC<Props> = ({
  handleFocusInput,
  handleQueryChange,
  query,
  suggestions,
  setSuggestions,
  setSelected,
  dropDown,
}) => {
  return (
    <>
      <div
        className={classNames('dropdown', {
          'is-active': dropDown && suggestions.length > 0,
        })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            data-cy="search-input"
            value={query}
            onChange={handleQueryChange}
            onFocus={handleFocusInput}
            onBlur={() => setSuggestions([])}
          />
        </div>

        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {suggestions.map(suggestion => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={suggestion.name}
                onMouseDown={() => setSelected(suggestion)}
              >
                <p className="has-text-link">{suggestion.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {query !== '' && suggestions.length === 0 && (
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
    </>
  );
};
