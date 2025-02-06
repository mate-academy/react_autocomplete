import React, { useCallback, useEffect, useState } from 'react';
import { Person } from '../../types/Person';
import debounce from 'lodash.debounce';

type Props = {
  persons: Person[];
  filterBy: string;
  delay?: number;
  onChangePerson: (person: Person) => void;
  onPersonEmpty: (isPersonInList: boolean) => void;
};

export const Autocomplete: React.FC<Props> = ({
  persons,
  filterBy,
  delay = 300,
  onChangePerson = () => {},
  onPersonEmpty = () => {},
}) => {
  const [visiblePersons, setVisiblePersons] = useState(persons);
  const filterTimeOut = useCallback(debounce(setVisiblePersons, delay), [
    delay,
  ]);
  const isPersonsEmpty = useCallback(debounce(onPersonEmpty, delay), [
    delay,
  ]);

  useEffect(() => {
    const newArray = persons.filter(val =>
      val.name.toLocaleLowerCase().includes(filterBy.toLocaleLowerCase()),
    );

    filterTimeOut(newArray);
    isPersonsEmpty(Boolean(newArray.length));
  }, [filterBy, persons]);

  return visiblePersons.map(person => (
    <div
      className="dropdown-item"
      data-cy="suggestion-item"
      key={person.slug}
      onClick={() => onChangePerson(person)}
    >
      <p className="has-text-link">{person.name}</p>
    </div>
  ));
};
