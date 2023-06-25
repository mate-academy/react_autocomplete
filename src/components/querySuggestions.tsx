import { FC } from 'react';

interface QuerySuggestionsProps {
  query: string,
  onChangeQuery: (value: string) => void,
  onChangeApplyQuery: (value: string) => void,
}

export const QuerySuggestions: FC<QuerySuggestionsProps> = (props) => {
  const {
    query,
    onChangeQuery,
    onChangeApplyQuery,
  } = props;

  return (
    <div className="dropdown-trigger">
      <input
        type="text"
        placeholder="Enter a part of the name"
        className="input"
        value={query}
        onChange={(event) => {
          onChangeQuery(event.target.value);
          onChangeApplyQuery(event.target.value);
        }}
      />
    </div>
  );
};
