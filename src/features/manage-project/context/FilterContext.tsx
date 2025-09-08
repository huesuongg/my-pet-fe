import { createContext, } from "react";
import { FilterType } from "../types";

interface FilterContextType {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  search: string;
  setSearch: (search: string) => void;
}

const FilterContext = createContext<FilterContextType>({
  filter: FilterType.ALL,
  setFilter: () => {},
  search: "",
  setSearch: () => {},
});

export default FilterContext;