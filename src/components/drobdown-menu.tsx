import { Person } from '../types/Person';

interface PropsDrobwon {
  isDrobdoun: boolean;
  clickDrobdoun: () => void;
  handleKeyboard: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  handleSelect: (event: React.MouseEvent<HTMLDivElement>) => void;
  handleName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  filtredName: Person[];
  inputValue: string;
}

export const Dropdown: React.FC<PropsDrobwon> = ({
  clickDrobdoun,
  handleKeyboard,
  handleSelect,
  handleName,
  isDrobdoun,
  filtredName,
  inputValue,
}) => {
  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          value={inputValue}
          onChange={handleName}
          onFocus={clickDrobdoun}
        />
      </div>
      {isDrobdoun && (
        <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
          <div className="dropdown-content">
            {filtredName.map(names => (
              <div
                className="dropdown-item"
                data-cy="suggestion-item"
                key={names.name}
                onClick={handleSelect}
                onKeyDown={handleKeyboard}
                role="button"
                tabIndex={0}
              >
                <p
                  className={
                    names.name === inputValue
                      ? 'has-text-danger'
                      : 'has-text-link'
                  }
                >
                  {names.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
