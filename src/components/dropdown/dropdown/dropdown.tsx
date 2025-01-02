import React, { useCallback, useRef, useState } from 'react';
import { DropDownMenu } from '../dropdownmenu/dropdown-menu';
import debounce from "lodash.debounce";
import { Person } from '../../../types/Person';

type Props = {
    delay: number,
    people: Person[],
    callback: (name: string) => void
}

export const DropDown: React.FC <Props> = ({delay, people, callback}) => {
    const [showString, setShowString] = useState('')
  const [filterString, setFilterString] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const filter = useCallback(debounce(setFilterString, delay), [])
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowString(event.target.value);
    callback(event.target.value)
    filter(event.target.value);
  }
  const input = useRef<HTMLInputElement>(null);
    return (<div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            value={showString}
            className="input"
            data-cy="search-input"
            onChange={(event) => handleFilterChange(event)}
            onFocus={() => {setIsFocused(!isFocused)}}
            onBlur={() => {setIsFocused(!isFocused)}}
            ref = {input}
          />
        </div>
        {isFocused && <DropDownMenu callback = {(name: string) => {setShowString(name); callback(name)}} persons={people}  filterString= {filterString}/>}
        
      </div>)
}