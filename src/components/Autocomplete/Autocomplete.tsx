import cn from 'classnames';
import './Autocomplete.scss';
import { useAutocomplete, UseAutocompleteProps } from './useAutocomplete';
import { Dropdown, DropdownProps } from './Dropdown';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { useRef } from 'react';

interface AutocompleteProps<TOption>
  extends Omit<UseAutocompleteProps<TOption>, 'debounceDelay'> {
  debounceDelay?: number;
  keyExtractor: DropdownProps<TOption>['keyExtractor'];
  renderOption: DropdownProps<TOption>['renderOption'];
}

export const Autocomplete = <TOption,>({
  debounceDelay = 300,
  dropdownOptions,
  searchKey,
  keyExtractor,
  onSelect,
  renderOption,
}: AutocompleteProps<TOption>) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const { value, options, open, onChange, onOpen, onClose, onSelectOption } =
    useAutocomplete({
      debounceDelay,
      dropdownOptions,
      searchKey,
      onSelect,
    });

  useOutsideClick({
    ref,
    callback: () => {
      onClose();
    },
  });

  return (
    <div
      ref={ref}
      className={cn('dropdown', {
        'is-active': open,
      })}
    >
      <div className="dropdown-trigger">
        <input
          value={value}
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          data-cy="search-input"
          onFocus={onOpen}
          onChange={onChange}
        />
      </div>

      <Dropdown
        dropdownOptions={options}
        renderOption={renderOption}
        keyExtractor={keyExtractor}
        onSelect={onSelectOption}
      />
    </div>
  );
};
