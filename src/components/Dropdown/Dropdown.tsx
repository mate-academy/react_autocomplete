import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { debounce } from 'lodash';
import cn from 'classnames';
import './index.css';

type Props = {
  placeholder: string;
  words: string[];
  delay: number;
  save: (name: string) => void;
};

export const Dropdown: React.FC<Props> = ({
  words,
  placeholder,
  delay,
  save,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [pending, setPending] = useState(true);
  const [selectedSug, setSelectedSug] = useState(-1);
  const [lastSelected, setLastSelected] = useState(-1);
  const [listOffset, setListOffset] = useState(0);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const dropdItemRef = useRef<HTMLButtonElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const itemHeight = 36;
  const dropdownHeight = 300;
  const noOfItems = dropdownHeight / itemHeight;

  const assertVisible = (index: number) => {
    if (dropdownRef.current && dropdItemRef.current) {
      const offset = (index - (noOfItems - 2)) * itemHeight;

      if (index === suggestions.length - 1) {
        setListOffset(offset > 0 ? -offset + itemHeight : 0);
      } else {
        setListOffset(offset > 0 ? -offset : 0);
      }
    }
  };

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (dropdownRef.current
        && !dropdownRef.current.contains(event.target as Node)
      ) {
        setPending(true);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const setSuggestionsDebounced = useCallback(
    debounce(() => {
      if (inputRef?.current?.value) {
        const input = inputRef.current.value.toLowerCase();

        setSuggestions(
          words.filter(word => word.toLowerCase().includes(input)),
        );
      } else {
        setSuggestions([]);
      }

      assertVisible(-1);
      setSelectedSug(-1);
      setPending(false);
    }, delay),
    [],
  );

  const handleInputChange = useCallback(
    () => {
      setPending(true);
      setSuggestionsDebounced();
    }, [],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'ArrowDown':
          if (selectedSug < suggestions.length - 1) {
            assertVisible(selectedSug + 1);
            setSelectedSug(prev => prev + 1);
          } else {
            assertVisible(0);
            setSelectedSug(0);
          }

          break;
        case 'ArrowUp':
          if (selectedSug > 0) {
            assertVisible(selectedSug - 1);
            setSelectedSug(prev => prev - 1);
          } else {
            assertVisible(suggestions.length - 1);
            setSelectedSug(suggestions.length - 1);
          }

          break;
        case 'Enter':
          if (inputRef?.current?.value) {
            if (selectedSug === -1) {
              if (suggestions.includes(inputRef.current.value)) {
                save(inputRef.current.value);
                inputRef.current.value = '';
              }
            } else {
              inputRef.current.value = suggestions[selectedSug];
              save(suggestions[selectedSug]);
              assertVisible(-1);
              setSelectedSug(-1);
            }
          }

          setPending(true);
          break;
        default:
          break;
      }
    }, [selectedSug, setSelectedSug, save, setPending, inputRef, assertVisible],
  );

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder={placeholder}
          className="input"
          ref={inputRef}
          onChange={() => handleInputChange()}
          onKeyDown={handleKeyDown}
          onClick={() => setPending(false)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        { !pending && !!suggestions.length && (
          <div className="dropdown-wrapper">
            <div
              className="dropdown-content"
              ref={dropdownRef}
              style={{ maxHeight: `${dropdownHeight}px` }}
            >
              {
                suggestions.map((word, i) => (
                  <button
                    type="button"
                    ref={selectedSug === i ? dropdItemRef : null}
                    key={word}
                    onMouseOver={() => {
                      setLastSelected(selectedSug);
                      setSelectedSug(i);
                    }}
                    onMouseLeave={() => {
                      setSelectedSug(lastSelected);
                    }}
                    onClick={() => {
                      if (inputRef.current) {
                        inputRef.current.value = suggestions[selectedSug];
                        save(suggestions[selectedSug]);
                        setSelectedSug(-1);
                        setPending(true);
                      }
                    }}
                    onKeyDown={() => {}}
                    aria-label={suggestions[i]}
                    onFocus={() => setSelectedSug(i)}
                    className={cn(
                      'dropdown-item has-text-link',
                      { selected: selectedSug === i },
                      { 'is-link': selectedSug !== i },
                    )}
                    style={{ top: `${listOffset}px`, height: `${itemHeight}px` }}
                  >
                    {word}
                  </button>
                ))
              }
            </div>
          </div>
        )}
        { !pending && !suggestions.length
          && (
            <div className="dropdown-content">
              <div>
                <p>
                  No matching suggestions
                </p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};
