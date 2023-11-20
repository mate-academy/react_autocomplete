import { createContext, useReducer } from 'react';
import { peopleFromServer } from '../../data/people';
import { Person } from '../../types/Person';

interface AutocompleteState {
  inputText: string;
  debouncedText: string;
  suggestions: Person[];
  displayedSuggestions: Person[];
  isFocused: boolean;
  selectedPerson: Person | null;
}

export enum AutocompleteActions {
  UpdateText = 'updateText',
  UpdateDebouncedText = 'updateDebouncedText',
  UpdateSuggestions = 'updateSuggestions',
  SelectPerson = 'selectPerson',
  UpdateDisplayedSuggestions = 'updateDisplayedSuggestions',
  UpdateIsFocused = 'updateIsFocused',
}

type AutocompleteAction =
  | { type: AutocompleteActions.UpdateText; payload: string }
  | { type: AutocompleteActions.UpdateDebouncedText; payload: string }
  | { type: AutocompleteActions.UpdateSuggestions; payload: Person[] }
  | { type: AutocompleteActions.SelectPerson; payload: Person }
  | { type: AutocompleteActions.UpdateDisplayedSuggestions; payload: Person[] }
  | { type: AutocompleteActions.UpdateIsFocused; payload: boolean };

const autocompleteReducer = (
  state: AutocompleteState,
  action: AutocompleteAction,
): AutocompleteState => {
  switch (action.type) {
    case AutocompleteActions.UpdateText:
      return {
        ...state,
        inputText: action.payload,
      };

    case AutocompleteActions.UpdateDebouncedText:
      return {
        ...state,
        debouncedText: action.payload,
      };

    case AutocompleteActions.UpdateSuggestions:
      return {
        ...state,
        suggestions: action.payload,
      };

    case AutocompleteActions.SelectPerson:
      return {
        ...state,
        selectedPerson: action.payload,
      };

    case AutocompleteActions.UpdateDisplayedSuggestions:
      return {
        ...state,
        displayedSuggestions: action.payload,
      };
    case AutocompleteActions.UpdateIsFocused:
      return {
        ...state,
        isFocused: action.payload,
      };

    default:
      return state;
  }
};

const initialAutocompleteState: AutocompleteState = {
  inputText: '',
  debouncedText: '',
  isFocused: false,
  suggestions: peopleFromServer,
  displayedSuggestions: peopleFromServer,
  selectedPerson: null,
};

interface StateProviderProps {
  children: React.ReactNode;
}

export const AutocompleteDispatchContext
  = createContext<(action: AutocompleteAction) => void>(() => { });

export const AutocompleteStateContext = createContext(initialAutocompleteState);

export const AutocompleteProvider: React.FC<
StateProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(
    autocompleteReducer, initialAutocompleteState,
  );

  return (
    <AutocompleteDispatchContext.Provider value={dispatch}>
      <AutocompleteStateContext.Provider value={state}>
        {children}
      </AutocompleteStateContext.Provider>
    </AutocompleteDispatchContext.Provider>
  );
};
