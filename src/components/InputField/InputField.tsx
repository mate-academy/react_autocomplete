import { useState, useCallback, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../../types/Person';

type Props = {
  onQuery: (query: string) => void;
  delay: number;
  selectedPerson: Person | null;
};

export const InputField: React.FC<Props> = ({
  delay,
  onQuery,
  selectedPerson,
}) => {
  const [query, setQuery] = useState('');

  const applyQuery = useCallback(
    debounce(onQuery, delay),
    [],
  );

  useEffect(() => {
    if (selectedPerson) {
      setQuery(`${selectedPerson.name}`);
      onQuery('');
    }
  }, [selectedPerson]);

  const handlerInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    onQuery('');
    applyQuery(event.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Enter a part of the name"
      className="input"
      value={query}
      onChange={handlerInputChange}
    />
  );
};
