import debounce from 'lodash.debounce';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';

export interface UseAutocompleteProps<TOption> {
  dropdownOptions: TOption[];
  searchKey: keyof TOption;
  debounceDelay: number;
  onSelect?: (option: TOption | null) => void;
}

export const useAutocomplete = <TOption>({
  debounceDelay,
  searchKey,
  dropdownOptions,
  onSelect,
}: UseAutocompleteProps<TOption>) => {
  const [value, setValue] = useState('');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const debouncedCall = useCallback(
    debounce((debounceQuery: string) => {
      setQuery(debounceQuery);

      if (onSelect) {
        onSelect(null);
      }
    }, debounceDelay),
    [],
  );

  const filteredDropdownOptions = useMemo(() => {
    if (!query) {
      return dropdownOptions;
    }

    return dropdownOptions.filter(option => {
      const optionValue = option[searchKey] as string;

      return optionValue.toLowerCase().includes(query.toLowerCase());
    });
  }, [dropdownOptions, searchKey, query]);

  const onOpen = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);

    debouncedCall(event.target.value);
  };

  const onSelectOption = (selected: TOption) => {
    if (onSelect) {
      onSelect(selected);
    }

    setValue(selected[searchKey] as string);
    setQuery(selected[searchKey] as string);
    onClose();
  };

  return {
    value,
    open,
    options: filteredDropdownOptions,
    onOpen,
    onClose,
    onChange,
    onSelectOption,
  };
};
