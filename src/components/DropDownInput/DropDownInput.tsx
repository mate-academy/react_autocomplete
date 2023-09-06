import { Dropdownmenu } from '../DropDownMenu';

export const DropdownInput: React.FC = () => {
  return (
    <>
      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
          />
        </div>
      </div>

      <Dropdownmenu />
    </>
  );
};
