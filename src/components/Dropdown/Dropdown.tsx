import React, { useCallback, useState, useMemo, useRef } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';

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

    const handleInputOnBlur = useCallback(() => {
      setVisibleDropdownMenu(false);
    }, []);
    // #endregion

    return (
      <div className="dropdown is-active">
        <div className="dropdown-trigger ">
          <div className="input" style={{ paddingInline: '0' }}>
            <input
              type="text"
              ref={queryInput}
              value={query}
              placeholder="Enter a part of the name"
              className="input"
              onChange={handleQueryChange}
              onFocus={handleInputOnFocus}
              onBlur={handleInputOnBlur}
            />
            <button
              type="button"
              className="button is-small is-inverted is-info"
              style={query ? {} : { display: 'none' }}
              onClick={handleBtnCancel}
            >
              <i className="fas fa-xmark"></i>
            </button>
            <button
              type="button"
              className="button is-small is-inverted is-info"
              onClick={handleBtnDropdown}>
              <i className="fas fa-angle-down"></i>
            </button>
          </div>
        </div>

        <div
          role="menu"
          className="dropdown-menu"
          style={visibleDropdownMenu ? {} : { display: 'none' }}
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

