import React, { useContext, useMemo, useReducer } from 'react';
import { Person } from '../../types/Person';
import { OnSelected } from '../../types/OnSelected';

type ChangeActive = (active: boolean) => void;
type ChangeInputPersonName = (inputPersonName: string) => void;

type State = {
  active: boolean;
  inputPersonName: string;
};

type ContextValue = {
  active: boolean;
  inputPersonName: string;
  delay: number;
};

type PeopleContextValue = {
  people: Person[];
  personName: string;
};

type ApiContextValue = {
  changeActive: ChangeActive;
  changeInputPersonName: ChangeInputPersonName;
  onSelected: OnSelected;
};

type ChangeActiveAction = {
  type: 'changeActive';
  payload: {
    active: boolean;
  };
};

type ChangeInputPersonNameAction = {
  type: 'changeInputPersonName';
  payload: {
    inputPersonName: string;
  };
};

type Action = ChangeActiveAction | ChangeInputPersonNameAction;

export const isPartInText = (text: string, part: string): boolean => {
  return text.toLowerCase().includes(part.trim().toLowerCase());
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'changeActive':
      return {
        ...state,
        active: action.payload.active,
      };
    case 'changeInputPersonName':
      return {
        ...state,
        inputPersonName: action.payload.inputPersonName,
      };
    default:
      throw new Error('Action type is not valid!!!');
  }
};

const Context = React.createContext<ContextValue | null>(null);

const PeopleContext = React.createContext<PeopleContextValue | null>(null);

const ApiContext = React.createContext<ApiContextValue | null>(null);

type Props = React.PropsWithChildren<{
  people: Person[];
  delay: number;
  personName: string;
  onSelected: OnSelected;
}>;

export const DropdownProvider = ({
  children,
  people,
  delay,
  personName,
  onSelected,
}: Props) => {
  const [state, dispatch] = useReducer(reducer, {
    active: false,
    inputPersonName: '',
  });

  const changeActive = (active: boolean) => {
    dispatch({ type: 'changeActive', payload: { active } });
  };

  const changeInputPersonName = (inputPersonName: string) => {
    dispatch({ type: 'changeInputPersonName', payload: { inputPersonName } });
  };

  const value = {
    ...state,
    delay,
  };

  const peopleValue = useMemo(
    () => ({
      people,
      personName,
    }),
    [people, personName],
  );

  const apiValue = useMemo(
    () => ({
      changeActive,
      changeInputPersonName,
      onSelected,
    }),
    [onSelected],
  );

  return (
    <ApiContext.Provider value={apiValue}>
      <PeopleContext.Provider value={peopleValue}>
        <Context.Provider value={value}>{children}</Context.Provider>
      </PeopleContext.Provider>
    </ApiContext.Provider>
  );
};

export const useDropdown = () => {
  const value = useContext(Context);

  if (!value) {
    throw new Error('DropdownProvider is missing!!!');
  }

  return value;
};

export const useDropdownPeople = () => {
  const value = useContext(PeopleContext);

  if (!value) {
    throw new Error('DropdownProvider is missing!!!');
  }

  return value;
};

export const useDropdownApi = () => {
  const value = useContext(ApiContext);

  if (!value) {
    throw new Error('DropdownProvider is missing!!!');
  }

  return value;
};
