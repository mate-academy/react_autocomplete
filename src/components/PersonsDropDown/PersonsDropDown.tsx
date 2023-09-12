import React, {
  useCallback, useMemo, useState,
} from 'react';
import PersonsList from '../PersonsList/PersonsList';
import { Person } from '../../types/Person';
import Search from '../Search/Search';
import { debounce } from '../../helpers/helpers';
import { peopleFromServer } from '../../data/people';
import { DEFAULT_DELAY } from '../../constants/default.constants';

const getUserByName = (
  users: Person[],
  query: string,
) => {
  let preparedUsers = [...users];

  if (query) {
    const queryToLower = query.toLowerCase().trim();

    preparedUsers = preparedUsers.filter(({ name }) => (
      name.toLowerCase().includes(queryToLower)
    ));
  }

  return preparedUsers;
};

type Props = {
  setSelectedPerson: (person: Person | null) => void;
  delay?: number,
};

const PersonsDropDown: React.FC<Props> = ({
  setSelectedPerson,
  delay,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [hasFocusField, setHasFocusField] = useState(true);
  const [appliedSearchValue, setAppliedSearchValue] = useState('');

  const preparedPersons = useMemo(() => {
    return getUserByName(peopleFromServer, appliedSearchValue);
  }, [peopleFromServer, appliedSearchValue]);

  const applySearchValue = useCallback(
    debounce(setAppliedSearchValue, delay || DEFAULT_DELAY),
    [],
  );

  const handleInputField = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchValue(event.target.value);
    applySearchValue(event.target.value);
  }, []);

  const handleUserSelect = (selected: Person) => {
    const preparedPerson = preparedPersons
      .find(({ slug }) => slug === selected.slug) ?? null;

    setSelectedPerson(preparedPerson);
    setSearchValue(preparedPerson?.name || '');
    applySearchValue(preparedPerson?.name || '');
  };

  return (
    <div className="dropdown is-active">
      <Search
        value={searchValue}
        handleInputField={handleInputField}
        setHasFocusField={setHasFocusField}
      />

      {hasFocusField && (
        preparedPersons.length ? (
          <PersonsList
            persons={preparedPersons}
            handleUserSelect={handleUserSelect}
          />
        )
          : (
            <h1 className="title">No matching suggestions</h1>
          ))}
    </div>
  );
};

export default PersonsDropDown;
