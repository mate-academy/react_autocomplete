import React, {
  useState,
  useCallback,
  useMemo,
} from 'react';
import classNames from 'classnames';
import debounce from 'lodash.debounce';
import { Person } from '../types/Person';

interface Props {
  people: Person[];
  onSelected: (person: Person | null) => void;
  delay: number;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  delay,
  onSelected = () => {},
}) => {
  const [selectedInput, setSelectedInput] = useState(false);
  const [inputText, setInputText] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');

  if (!appliedQuery) {
    onSelected(null);
  }

  const openMenu = () => setSelectedInput(true);
  const closeMenu = () => setSelectedInput(false);

  const sortedListOfPeople = useMemo(() => {
    return people.filter(
      person => person.name.toLocaleLowerCase().trim()
        .includes(appliedQuery.toLocaleLowerCase().trim()),
    );
  }, [appliedQuery, people]);

  const sortPeople = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
    sortPeople(event.target.value);
  };

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    person: Person,
  ) => {
    event.preventDefault();

    onSelected(person);
    setInputText(person.name);
    setAppliedQuery(person.name);
    closeMenu();
  };

  return (
    <div className={
      classNames('dropdown', {
        'is-active': selectedInput,
      })
    }
    >
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          value={inputText}
          onChange={handleChange}
          className="input"
          onFocus={openMenu}
          onBlur={() => setTimeout(closeMenu, 200)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content">
          {
            sortedListOfPeople.length > 0
              ? (
                sortedListOfPeople.map((person) => (
                  <a
                    key={person.slug}
                    href="###"
                    onClick={(event) => handleClick(event, person)}
                    className="dropdown-item"
                  >
                    <p className="has-text-link">{person.name}</p>
                  </a>
                )))
              : (
                <div className="dropdown-item">
                  <p>No matching suggestions</p>
                </div>
              )
          }
        </div>
      </div>
    </div>
  );
};
