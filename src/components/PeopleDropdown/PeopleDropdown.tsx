import debounce from 'lodash.debounce';
import React, { useCallback } from 'react';

interface Props {
  query: string;
  isNotHide: boolean;
  delay: {
    mainDelay: number,
    blurDelay: number,
  };
  setQuery: (value: string) => void;
  setIsNotHide: (value: boolean) => void;
  applyQuery: (value: string) => void;
}

export const PeopleDropdown: React.FC<Props> = ({
  query,
  isNotHide: isHide,
  delay,
  setIsNotHide: setIsHide,
  setQuery,
  applyQuery,
}) => {
  const handleClickHide = () => {
    setIsHide(!isHide);
  };

  const { mainDelay, blurDelay } = delay;

  const applyHide = useCallback(
    debounce(setIsHide, mainDelay),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
    applyHide(true);
  };

  const applyBlur = useCallback(
    debounce(setIsHide, blurDelay),
    [],
  );

  const handleBlur = () => applyBlur(false);

  return (
    <div className="dropdown-trigger">
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        value={query}
        onChange={handleQueryChange}
        onClick={handleClickHide}
        onBlur={handleBlur}
      />
    </div>
  );
};
