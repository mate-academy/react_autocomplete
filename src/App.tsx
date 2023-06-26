import {
  ChangeEvent,
  FC,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import cn from 'classnames';
import './App.scss';
import { peopleFromServer } from './data/people';
import { Person } from './types/Person';
import { DropDownContent } from './components/DropDownContent/DropDownContent';

const debounce = <T extends (...args: never[]) => void>(
  func: T,
  delay: number,
) => {
  let timerId: NodeJS.Timeout;

  return (...args: Parameters<T>): void => {
    clearTimeout(timerId);
    timerId = setTimeout(func, delay, ...args);
  };
};

export const App: FC = () => {
  const [peoples, setPeoples] = useState<Person[]>([]);
  const [query, setQuery] = useState('');
  const [isSelectedQuery, setIsSelectedQuery] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState('');

  useEffect(() => {
    setPeoples(peopleFromServer);
  }, []);

  const queryWithDelay = useCallback(debounce(setIsSelectedQuery, 300), []);

  const changeQuery = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);

    setQuery(value);
    if (!value) {
      queryWithDelay(false);
    } else {
      queryWithDelay(true);
    }
  };

  const onSelectPerson = (
    event: MouseEvent,
    person: Person,
  ) => {
    event.preventDefault();

    setSelectedSlug(person.slug);
    setQuery(person.name);
    setIsSelectedQuery(false);
  };

  const visiblePeoples = peoples.filter(person => (
    person.name.toLowerCase().trim().includes(query.toLowerCase())
  ));

  const getPeopleBySlug = (slug: string) => {
    return peoples.find(person => person.slug === slug);
  };

  const selectedPerson = getPeopleBySlug(selectedSlug);
  const { name, born, died } = selectedPerson ?? {};

  return (
    <main className="section">
      <h1 className="title">
        {selectedSlug
          ? `${name} (${born} = ${died})`
          : 'No selected person'}
      </h1>

      <div className={cn('dropdown', {
        'is-active': isSelectedQuery,
      })}
      >
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={changeQuery}
          />
        </div>

        <div className="dropdown-menu" role="menu">
          <DropDownContent
            visiblePeoples={visiblePeoples}
            selectedSlug={selectedSlug}
            onSelectPerson={onSelectPerson}
          />
        </div>
      </div>
    </main>
  );
};
