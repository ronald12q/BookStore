import {SearchField} from "@heroui/react";
import { searchStore } from "../../store/searchStore";
import { useEffect } from "react";
import { getBooksHook } from "../../hooks/getBookHook";


export const SearchForm = () => {

  const {param, setParam} = searchStore();
  const {getApiBook} = getBooksHook();
  useEffect(() => {

    
    const timer = setTimeout(() => {

      getApiBook(param);

    }, 500)

    // useEffect necesita devolver una funcion de limpieza, no ejecutar clearTimeout directo.
    return () => clearTimeout(timer);

  },[param]);

  return (
    <SearchField name="search">
      <SearchField.Group className='bg-veloura-surface-offset focus-within:ring-veloura-accent'>
        <SearchField.SearchIcon />
        <SearchField.Input value={param}  onChange={(e) => setParam(e.target.value)} className="w-[450px] h-[150px]" placeholder="Search..." />
        <SearchField.ClearButton />
      </SearchField.Group>
    </SearchField>
  );
};
