import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';
import { PeoplesNames } from '../types/Person';

type Props = {
  peoplesNames: PeoplesNames[];
  onSelected: (person: string) => void;
  delay: number;
};

export const Autocomplete: React.FC<Props> = ({
  peoplesNames,
  onSelected,
  delay,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [processedQuery, setProcessedQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PeoplesNames[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleDelayedChange = useCallback(
    debounce(setProcessedQuery, delay),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputQuery(event.target.value);
    handleDelayedChange(event.target.value);
  };

  useMemo(() => {
    const filteredSuggestions = peoplesNames
      .filter((person) => person.name.toLowerCase()
        .includes(processedQuery.toLowerCase()));

    setSuggestions(filteredSuggestions);
  }, [processedQuery]);

  return (
    <div
      className={classNames(
        'dropdown',
        { 'is-active': isFocused },
      )}
      ref={dropdownRef}
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={inputQuery}
          onChange={handleQueryChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>

      <div
        className="dropdown-menu"
        role="menu"
      >
        {!suggestions.length
          ? (
            <div className="dropdown-item">
              <p className="has-text-danger">No matching suggestions</p>
              {onSelected('')}
            </div>
          ) : (
            <div className="dropdown-content">
              {suggestions.map((suggestion) => {
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
