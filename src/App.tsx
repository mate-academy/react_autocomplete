import debounce from 'lodash.debounce';
import React, { useEffect, useMemo, useState } from 'react';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';

type Props = {
  inputDelay?: number;
  onSelected?: (person: Person | null) => void;
};

export const App: React.FC<Props> = ({
  inputDelay = 300,
  onSelected = () => {},
}) => {
  const [immediateQuery, setImmediateQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isListShown, setIsListShown] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  // Створюємо стабільну версію debounce функції
  const debouncedApplyQuery = useMemo(() => {
    return debounce((value: string) => {
      setAppliedQuery(value);
    }, inputDelay);
  }, [inputDelay]);

  // Очищення при розмонтуванні
  useEffect(() => {
    return () => {
      debouncedApplyQuery.cancel();
    };
  }, [debouncedApplyQuery]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Скидаємо вибір, якщо користувач почав писати
    setSelectedPerson(null);
    onSelected(null);

    setImmediateQuery(value);

    // ВІДПОВІДЬ НА РЕВ'Ю: trim() запобігає фільтрації, якщо введено лише пробіли
    debouncedApplyQuery(value.trim());
  };

  const handlePersonSelect = (person: Person) => {
    // ВІДПОВІДЬ НА РЕВ'Ю: скасовуємо чергу debounce, щоб старий запит не перебив вибір
    debouncedApplyQuery.cancel();

    setSelectedPerson(person);
    setImmediateQuery(person.name);

    // ВІДПОВІДЬ НА РЕВ'Ю: синхронізуємо appliedQuery з вибором
    setAppliedQuery(person.name);

    setIsListShown(false);
    onSelected(person);
  };

  const filteredPeople = useMemo(() => {
    // Якщо запит порожній — показуємо всіх
    if (appliedQuery === '') {
      return peopleFromServer;
    }

    const normalizedQuery = appliedQuery.toLowerCase();

    return peopleFromServer.filter(person =>
      person.name.toLowerCase().includes(normalizedQuery)
    );
  }, [appliedQuery]);

  return (
    <div className="container">
      <main className="section is-flex is-flex-direction-column">
        <h1 className="title" data-cy="title">
          {selectedPerson
            ? `${selectedPerson.name} (${selectedPerson.born} - ${selectedPerson.died})`
            : 'No selected person'}
        </h1>

        <div className={`dropdown ${isListShown && !selectedPerson ? 'is-active' : ''}`}>
          <div className="dropdown-trigger">
            <input
              type="text"
              className="input"
              data-cy="search-input"
              placeholder="Enter a part of the name"
              value={immediateQuery}
              onChange={handleQueryChange}
              onFocus={() => setIsListShown(true)}
              onBlur={() => setTimeout(() => setIsListShown(false), 200)}
            />
          </div>

          <div className="dropdown-menu" role="menu" data-cy="suggestions-list">
            <div className="dropdown-content">
              {filteredPeople.length > 0 ? (
                filteredPeople.map(person => (
                  <button
                    type="button"
                    key={person.slug}
                    className="dropdown-item is-link is-fullwidth has-text-left"
                    data-cy="suggestion-item"
                    onClick={() => handlePersonSelect(person)}
                  >
                    {person.name}
                  </button>
                ))
              ) : (
                <div className="dropdown-item has-text-grey">
                  No matching suggestions
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Повідомлення про відсутність результатів винесено окремо за ТЗ */}
        {appliedQuery !== '' && filteredPeople.length === 0 && (
          <div
            className="notification is-danger is-light mt-3 is-align-self-flex-start"
            role="alert"
            data-cy="no-suggestions-message"
          >
            <p className="has-text-danger">No matching suggestions</p>
          </div>
        )}
      </main>
    </div>
  );
};
