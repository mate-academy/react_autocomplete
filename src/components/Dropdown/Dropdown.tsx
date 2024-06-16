import { Person } from '../../types/Person';
import { OnSelected } from '../../types/OnSelected';
import { DropdownProvider } from './Context';
import { DropdownElement } from './DropdownElement';

type Props = {
  people: Person[];
  delay?: number;
  personName: string;
  onSelected: OnSelected;
};

export const Dropdown: React.FC<Props> = ({
  people,
  delay = 300,
  personName,
  onSelected,
}) => (
  <DropdownProvider
    people={people}
    delay={delay}
    personName={personName}
    onSelected={onSelected}
  >
    <DropdownElement />
  </DropdownProvider>
);
