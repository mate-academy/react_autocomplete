import { PeopleDropdown } from '../PeopleDropdown';
import { PeopleMenu } from '../PeopleMenu';

export const Autocomplete = () => {
  return (
    <div className="dropdown is-active">
      <PeopleDropdown />

      <PeopleMenu />
    </div>
  );
};
