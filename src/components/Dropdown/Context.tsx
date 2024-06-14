import React, { useReducer } from 'react';
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
  people: Person[];
  delay: number;
  personName: string;
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

export const reducer = (state: State, action: Action): State => {
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

export const Context = React.createContext<ContextValue>({
  active: false,
  inputPersonName: '',
  people: [],
  delay: 300,
  personName: '',
  changeActive: () => {},
  changeInputPersonName: () => {},
  onSelected: () => {},
});

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

  const value: ContextValue = {
    ...state,
    people,
    delay,
    personName,
    changeActive,
    changeInputPersonName,
    onSelected,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
