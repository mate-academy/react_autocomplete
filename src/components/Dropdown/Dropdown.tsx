import React, { useCallback, useState, useMemo, useRef } from 'react';

import './Dropdown.scss';
import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';
import cn from 'classnames';

type Props<Ty> = {
  items: Ty[],
  filtrationDelay: number,
  filterFn: (items: Ty[], query: string) => Ty[],
  //Set selected item and return info for 'dropdown-trigger' aria
  onSelected: (item: Ty | null) => string | undefined,
};


export const Dropdown: React.FC<Props<Person>>
  = ({
    items,
    filtrationDelay = 1000,
    filterFn,
    onSelected,
  }) => {
    // #region state
    const [query, setQuery] = useState('');
    const [appliedQuery, setAppliedQuery] = useState('');
    const [visibleDropdownMenu, setVisibleDropdownMenu]
      = useState<boolean>(false);
    // #endregion

    const filteredItems = useMemo(() => {
      return filterFn([...items], appliedQuery);
    }, [filterFn, items, appliedQuery],);

    const applyQuery = useCallback(
      debounce(setAppliedQuery, filtrationDelay), [filtrationDelay],);

    const queryInput = useRef<HTMLInputElement | null>(null);

    const onElementFocus = (
      ref: React.MutableRefObject<HTMLInputElement | null>
    ) => {
      if (ref.current) {
        ref.current.focus();
      }
    };

    // #region handle
    const handleSelect = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      item: typeof items[0] | null,
    ) => {
      event.preventDefault();
      setVisibleDropdownMenu(false);
      setQuery(onSelected(item) || '');
      applyQuery('');
    };

    const handleBtnCancel = () => {
      setQuery('');
      applyQuery('');
      onElementFocus(queryInput);
    };

    const handleBtnDropdown = () => {
      setVisibleDropdownMenu(prev => !prev);
    };

    const handleQueryChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value);
        applyQuery(event.target.value);

        if (!event.target.value) {
          onSelected(null);
        }
      }, []
    );

    const handleInputOnFocus = useCallback(() => {
      setVisibleDropdownMenu(true);
    }, []);

    const handleInputOnBlur = useCallback((event) => {
      console.info(
        'timeStamp = %d\n'
        + 'target = %s\n'
        + 'currentTarget = %s\n'
        + 'relatedTarget = %s',
        event.timeStamp,
        event.target,
        event.currentTarget,
        event.relatedTarget,
      );

      if (event.currentTarget.contains(event.relatedTarget)) {
        return;
      }

      setVisibleDropdownMenu(false);
    }, []);
    // #endregion

    return (
      <div className="dropdown is-active">
        <div className="dropdown-trigger ">
          <div
            className="input has-input-inner"
            onBlur={handleInputOnBlur}
          >
            <input
              type="text"
              name="input-inner"
              ref={queryInput}
              value={query}
              placeholder="Enter a part of the name"
              className="input-inner"
              onChange={handleQueryChange}
              onFocus={handleInputOnFocus}
            />
            <button
              type="button"
              className={cn("button is-small is-white", {
                'is-hidden': !query,
              })}
              onClick={handleBtnCancel}
            >
              <i className="fas fa-xmark" />
            </button>
            <button
              type="button"
              className="button is-small is-white"
              onClick={handleBtnDropdown}>
              <i
                className={cn("fas fa-angle-down", {
                  'is-flap-v': visibleDropdownMenu,
                })}
              />
            </button>
          </div>
        </div>

        <div
          role="menu"
          className={cn("dropdown-menu", {
            'is-hidden': !visibleDropdownMenu,
          })}
        >
          <div className="dropdown-content">
            {
              filteredItems.length
                ? (
                  filteredItems.map(item => (
                    <button
                      type="button"
                      key={item?.slug}
                      className="dropdown-item button is-white"
                      onMouseDown={(event) => { handleSelect(event, item) }}
                    >
                      <p className="has-text-link">{item?.name}</p>
                    </button>
                  ))
                )
                : (
                  <button
                    type="button"
                    className="dropdown-item button is-white"
                    onMouseDown={(event) => { handleSelect(event, null) }}
                  >
                    <p className="has-text-danger">No matching suggestions</p>
                  </button>
                )
            }
          </div>
        </div>
      </div>
    );
  };

