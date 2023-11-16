import { Person } from '../../types/Person';

type Props = {
  person: Person;
  selectedPerson: (person: Person) => Person | void;
};

export const PostPeople:React.FC<Props> = ({ person, selectedPerson }) => {
  return (
    <>
      <div className="dropdown-item">
        <p
          className="has-text-link"
          onClick={() => {
            selectedPerson(person);
          }}
        >
          {person.name}
        </p>
      </div>
    </>
  );
};
