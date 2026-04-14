import { SearchField} from "@heroui/react";


export const SearchForm = () => {
  return (
    <SearchField name="search">
      <SearchField.Group className='bg-veloura-surface-offset'>
        <SearchField.SearchIcon />
        <SearchField.Input className="w-[350px]" placeholder="Search..." />
        <SearchField.ClearButton />
      </SearchField.Group>
    </SearchField>
  );
};