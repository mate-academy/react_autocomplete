import React, { useCallback, useState, useMemo } from 'react';
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
    }, [appliedQuery],);

    const applyQuery = useCallback(
      debounce(setAppliedQuery, filtrationDelay), [],);

    // #region handle
    const handleSelect = useCallback(
      (item: typeof items[0] | null) => {
        setVisibleDropdownMenu(false);
        setQuery(onSelected(item) || '');
        applyQuery('');
      }, [],);

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      applyQuery(event.target.value);
    };

    const handleInputOnFocus = useCallback(() => {
      setVisibleDropdownMenu(true);
    }, [],);

    const handleInputOnBlur = useCallback(() => {
      setVisibleDropdownMenu(false);
    }, [],);
    // #endregion

    return (
      <div className="dropdown is-active">
        <div className="dropdown-trigger ">
          <div className="input" style={{paddingInline: '0'}}>
            <input
              type="text"
              value={query}
              placeholder="Enter a part of the name"
              className="input"
              onChange={handleQueryChange}
              onFocus={handleInputOnFocus}
              onBlur={handleInputOnBlur}
            />
            <button
              className="button is-small is-inverted is-info"
              style={query ? {} : { display: 'none' }}
              onClick={() => { setQuery(''); applyQuery(''); }}
            >
              <i className="fas fa-xmark"></i>
            </button>
            <button className="button is-small is-inverted is-info"
              onClick={() => setVisibleDropdownMenu(prev => !prev)}>
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
                    <a
                      href="#"
                      role="button"
                      key={item?.slug}
                      className="dropdown-item"
                      onMouseDown={() => { handleSelect(item) }}
                    >
                      <p className="has-text-link">{item?.name}</p>
                    </a>
                  ))
                )
                : (
                  <a
                    href="#"
                    role="button"
                    className="dropdown-item"
                    onMouseDown={() => { handleSelect(null) }}
                  >
                    <p className="has-text-danger">No matching suggestions</p>
                  </a>
                )
            }
          </div>
        </div>
      </div>
    );
  };

