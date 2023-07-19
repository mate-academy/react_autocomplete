import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import classNames from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { DropdownSearch } from './components/DropdownSearch';
import { DropdownList } from './components/DropdownList';
import { Person } from './types/Person';

export const App: React.FC = () => {
  const [filterField, setFilterField] = useState('');
  const [appliedFilter, setAppliedFilter] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isOpened, setIsOpened] = useState(true);

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter(person => {
      const normalizedfilterField = appliedFilter.toLowerCase().trim();
      const normalizedName = person.name.toLowerCase();

      return normalizedName.includes(normalizedfilterField);
    });
  }, [appliedFilter]);

  const selectedPersonBlock = selectedPerson
    ? `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
    : 'No one is selected';

  const getSelectedPerson = useCallback((personSlug: string) => {
    setIsOpened(false);
    setSelectedPerson(peopleFromServer.find(person => {
      return personSlug === person.slug;
    }) || null);
  }, []);

  useEffect(() => {
    setFilterField(selectedPerson?.name || '');
  }, [selectedPerson]);

  useEffect(() => {
    setIsOpened(true);
  }, [appliedFilter]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPersonBlock}
      </h1>

      <div className={classNames('dropdown', {
        'is-active': isOpened,
      })}
      >

        <DropdownSearch
          filterField={filterField}
          onChange={(newFilterField) => setFilterField(newFilterField)}
          setAppliedFilter={(newQuery) => setAppliedFilter(newQuery)}
          delay={500}
          setIsOpened={(value) => setIsOpened(value)}
        />

        <div className="dropdown-menu" role="menu">
          <DropdownList
            people={filteredPeople}
            onSelect={getSelectedPerson}
          />
        </div>

      </div>
    </main>
  );
};
