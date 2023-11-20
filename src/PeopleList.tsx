import { useCallback, useMemo, useState } from 'react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

import { Person } from './types/Person';

interface Props {
  people: Person[];
  onSelect: (persone: Person) => void;
  delay: number;
}

export const Peoplelist: React.FC<Props> = ({ people, onSelect, delay }) => {
  const [textField, setTextField] = useState('');
  const [appliedtextField, setAppliedtextField] = useState('');
  const [isHide, setIsHide] = useState(false);

  const handleApplyTextSet = (value: string) => {
    setAppliedtextField(value);
    setIsHide(true);
  };

  const applyTextField = useCallback(
    debounce(handleApplyTextSet, delay), [],
  );

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsHide(false);
    setTextField(event.target.value);
    applyTextField(event.target.value);
  };

  const handleButtonClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    person: Person,
  ) => {
    event.preventDefault();

    setTextField(person.name);
    onSelect(person);
    setIsHide(false);
  };

  const handleFocus = () => {
    if (textField === '') {
      setIsHide(true);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (!event.relatedTarget) {
      setIsHide(false);
    }
  };

  const currentPiople = useMemo(() => {
    return people.filter(person => (
      person.name.toLowerCase().includes(appliedtextField.toLowerCase())
    ));
  }, [appliedtextField, people]);

  return (
    <div className="dropdown is-active">
      <div className="dropdown-trigger">
        <input
          type="text"
          placeholder="Enter a part of the name"
          value={textField}
          onChange={handleTextChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="input"
        />
      </div>

      <div className="dropdown-menu" role="menu">
        {isHide && (
          <div className="dropdown-content">
            {currentPiople.length
              ? currentPiople.map((person) => (
                <div
                  key={person.name}
                  className="dropdown-item"
                >
                  <a
                    href="/"
                    className={classNames('button is-light', {
                      'has-text-link': person.sex === 'm',
                      'has-text-danger': person.sex === 'f',
                    })}
                    onClick={(event) => handleButtonClick(event, person)}
                  >
                    {person.name}
                  </a>
                </div>
              ))
              : 'No matching suggestions'}
          </div>
        )}
      </div>
    </div>
  );
};
