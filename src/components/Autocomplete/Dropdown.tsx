import React from 'react';

export interface DropdownProps<TOption> {
  dropdownOptions: TOption[];
  keyExtractor: (value: TOption) => string;
  renderOption: (value: TOption, idx: number) => React.ReactNode;
  onSelect: (value: TOption) => void;
}

export const Dropdown = React.memo(
  <TOption,>({
    dropdownOptions,
    keyExtractor,
    renderOption,
    onSelect,
  }: DropdownProps<TOption>) => (
    <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
      <div className="dropdown-content">
        {dropdownOptions.map((option, idx) => {
          const key = keyExtractor(option);

          return (
            <div key={key} onClick={() => onSelect(option)}>
              {renderOption(option, idx)}
            </div>
          );
        })}

        {!dropdownOptions.length && (
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
      </div>
    </div>
  ),
);
