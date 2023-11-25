import { useCallback, useMemo, useState } from "react";
import { Person } from "../../types/Person";
import classNames from "classnames";
import debounce from "lodash.debounce"

interface Props {
  people: Person[];
  setPerson?:(person:Person) => void;
  delay: number;
}

export const Autocomplete: React.FC<Props> = ({
  people,
  setPerson = () => {},
  delay,
}) => {

  const [dropdownActive, setDropdownActive] = useState(false);
  const [applyedQury, setApplyedQury] = useState('');
  const [choosePeople, setChoosePeople] = useState('');
  
  const applyQury = useMemo(
    () => debounce(setApplyedQury, delay),
    [],
  );
  const selectPerson =(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, person: Person) => {
    event.preventDefault(),
    setChoosePeople(person.name)
    setPerson(person);
    setDropdownActive(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChoosePeople(e.target.value);
    applyQury(e.target.value)
    console.log('m')

  }

  const peopleFilter = useMemo(() => {
    return people.filter(people => people.name.toLocaleLowerCase().includes(applyedQury.toLocaleLowerCase()))
  },[applyedQury])


  return (
    <div className={classNames('dropdown', {
      " is-active": dropdownActive
    })}>
      <div className="dropdown-trigger ">
        <input
          type="text"
          value={choosePeople}
          aria-haspopup="true"
          placeholder="Enter a part of the name"
          className="input"
          onChange={handleInputChange}
          onFocus={() => setDropdownActive(true)}
        />
      </div>

      <div className="dropdown-menu" role="menu">
        <div className="dropdown-content"
          style={{overflow:'auto', height:'300px'}}
        >
          { peopleFilter.length ?
            peopleFilter.map(person => (
              <a className="dropdown-item"
                key={person.name}
                href="/#"
                onClick={event => selectPerson(event, person)}
              >
                <p
                  className="has-text-link"
                >
                  {person.name}
                </p>
              </a>
            ))
          :'No matching suggestions'
        }
          {/* <div className="dropdown-item">
            <p className="has-text-danger">Petronella de Decker</p>
          </div>

          <div className="dropdown-item">
            <p className="has-text-danger">Elisabeth Hercke</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};
