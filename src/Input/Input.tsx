import { Person } from '../types/Person';

type Props = {
  appliedQuery: string,
  showPeople?: boolean,
  selectedPerson: Person | null,
  setSelectedPerson: (person: Person | null) => void,
  handleQueryChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  setAppliedQuery?: (string: string) => void,
  setShowPeople?: (show: boolean) => void,
  query?: string,
  setQuery: (string: string) => void,
};

export const Input: React.FC<Props> = ({
  appliedQuery,
  showPeople = false,
  selectedPerson = null,
  handleQueryChange,
  setShowPeople = () => { },
  setAppliedQuery = () => { },
  setSelectedPerson = () => { },
  query,
  setQuery = () => {},
}) => {
  const handleSelectedPerson = () => {
    if (!selectedPerson) {
      return query;
    }

    return selectedPerson.name;
  };

  const handleDeleteQuery = () => {
    setAppliedQuery('');
    setQuery('');
    setSelectedPerson(null);
  };

  return (
    <div className="dropdown-trigger  control has-icons-right">
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        value={handleSelectedPerson()}
        onClick={() => setShowPeople(showPeople)}
        onChange={handleQueryChange}
      />

      {(appliedQuery.length > 0 || selectedPerson) && (
        <span className="icon is-small is-right">
          <button
            type="button"
            className="delete is-small"
            onClick={handleDeleteQuery}
          >
            x
          </button>
        </span>
      )}
    </div>
  );
};
