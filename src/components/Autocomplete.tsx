import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
} from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { Person } from '../types/Person';

type Props = {
  people: Person[];
  onSelected: (person: string) => void;
  delay: number;
};

export const Autocomplete: React.FC<Props> = ({
  people,
  onSelected,
  delay,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [processedQuery, setProcessedQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleDelayedChange = useCallback(
    debounce(setProcessedQuery, delay),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputQuery(event.target.value);
    handleDelayedChange(event.target.value);
  };

  const handleOnFocus = () => {
    setInputQuery('');
    setProcessedQuery('');
    setIsFocused(true);
  };

  const filteredSuggestions = useMemo(
    () => people
      .filter((person) => person.name.toLowerCase()
        .includes(processedQuery.toLowerCase())),
    [processedQuery],
  );

  useEffect(() => {
    if (!filteredSuggestions.length) {
      onSelected('');
    }
  }, [filteredSuggestions.length]);

  return (
    <div
      className={classNames(
        'dropdown',
        { 'is-active': isFocused },
      )}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={inputQuery}
          onChange={handleQueryChange}
          onFocus={handleOnFocus}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      <div
        className="dropdown-menu"
        role="menu"
      >
        {!filteredSuggestions.length
          ? (
            <div className="dropdown-item">
              <p className="has-text-danger">No matching suggestions</p>
            </div>
          ) : (
            <div className="dropdown-content">
              {filteredSuggestions.map((suggestion) => {
                const { name, slug, sex } = suggestion;

                return (
                  <a
                    className="dropdown-item"
                    key={slug}
                    href={`#${slug}`}
                    onMouseDown={() => {
                      onSelected(slug);
                      setInputQuery(name);
                      setIsFocused(false);
                    }}
                  >
                    <p
                      className={classNames({
                        'has-text-link': sex === 'm',
                        'has-text-danger': sex === 'f',
                      })}
                    >
                      {name}
                    </p>
                  </a>
                );
              })}
            </div>
          )}
      </div>
    </div>
  );
};
