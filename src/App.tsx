import {
  FC, FocusEventHandler, MouseEvent, useEffect, useState,
} from 'react';
import cn from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { AppProps } from './types/AppProps';

export const App: FC<AppProps> = ({ queryDelay = 1000 }) => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [visiblePeople, setVisiblePeople] = useState(peopleFromServer);
  const [selectedPerson, setSelectedPerson] = useState<Person>({
    name: '',
    sex: 'm',
    born: 0,
    died: 0,
    fatherName: '',
    motherName: '',
    slug: '',
  });

  const { name, born, died } = selectedPerson;

  const handleInputBlur: FocusEventHandler<HTMLInputElement> = (event) => {
    if (event.relatedTarget?.className === 'dropdown-item') {
      return;
    }

    setShowDropdown(false);
  };

  const onSelected
  = (event: MouseEvent<HTMLAnchorElement>, person: Person) => {
    event.preventDefault();
    setSelectedPerson(person);
    setShowDropdown(false);
    setQuery('');
  };

  useEffect(() => {
    if (query) {
      setShowDropdown(false);
    }

    const timeoutId = setTimeout(() => {
      let filteredPeople = [...peopleFromServer];

      if (query) {
        filteredPeople = filteredPeople
          .filter(person => person.name.toLocaleLowerCase()
            .includes(query.toLocaleLowerCase()));
      }

      setVisiblePeople(filteredPeople);
      if (query) {
        setShowDropdown(true);
      }
    }, queryDelay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [query, queryDelay]);

  return (
    <main className="section">
      {
        selectedPerson.name
          ? (
            <h1 className="title">
              {`${name} (${born} = ${died})`}
            </h1>
          )
          : (
            <h1 className="title">
              No selected person
            </h1>
          )
      }

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={(e) => setQuery(e.target.value.trimStart())}
            onBlur={handleInputBlur}
            onClick={() => setShowDropdown(prev => !prev)}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <div
            className={cn('dropdown-content', {
              'is-hidden': !showDropdown,
            })}
          >
            {
              !visiblePeople.length
                ? (
                  <span className="has-text-grey-light">
                    No matching suggestions
                  </span>
                )
                : (
                  visiblePeople.map(person => (
                    <a
                      key={person.slug}
                      href={`#${person.slug}`}
                      className="dropdown-item"
                      onClick={(e) => onSelected(e, person)}
                    >
                      <p
                        className={cn({
                          'has-text-danger': person.sex === 'f',
                          'has-text-info': person.sex === 'm',
                        })}
                      >
                        {person.name}
                      </p>
                    </a>
                  )))
            }
          </div>
        </div>
      </div>
    </main>
  );
};
