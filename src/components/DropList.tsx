import { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

type Props = {
  people: Person[],
  delay: number,
  onSelected: (people: Person | null) => void,
};

export const DropList: React.FC<Props> = ({
  people,
  delay,
  onSelected,
}) => {
  const [focus, setFocus] = useState(false);
  const [queryPeople, setQueryPeople] = useState('');
  const [appliedQueryPeople, setAppliedQueryPeople] = useState('');

  const applyQueryPeople = useCallback(debounce(
    setAppliedQueryPeople, delay,
  ), []);

  const handleSelectPerson = (person: Person) => {
    onSelected(person);
    setQueryPeople(person.name);
    applyQueryPeople(person.name);
  };

  const handleQueryPeople = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryPeople(e.target.value);
    applyQueryPeople(e.target.value);
  };

  const filteredPeople = useMemo(() => {
    return people.filter(
      (peop) => peop.name.toLowerCase().trim()
        .includes(queryPeople.toLowerCase().trim()),
    );
  }, [appliedQueryPeople, people]);

  return (
    <div className={focus ? 'dropdown is-active' : 'dropdown'}>
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          className="input"
          value={queryPeople}
          onChange={handleQueryPeople}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />

        <button
          type="button"
          onClick={() => {
            setQueryPeople('');
            applyQueryPeople('');
            onSelected(null);
          }}
        >
          Reset
        </button>
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {
            filteredPeople.length ? (
              filteredPeople.map((peop) => (
                <a
                  href="/"
                  className="dropdown-item"
                  key={peop.slug}
                  onMouseDown={() => handleSelectPerson(peop)}
                >
                  <p
                    className={peop.sex === 'm'
                      ? 'has-text-link'
                      : 'has-text-danger'}
                  >
                    {peop.name}
                  </p>
                </a>
              ))
            ) : (
              <div className="dropdown-item">No matching suggestions</div>
            )
          }
        </div>
      </div>
    </div>
  );
};
