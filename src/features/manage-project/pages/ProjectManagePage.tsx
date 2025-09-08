import styles from "./ProjectManagePage.module.css";
import { Heading } from "../components/project-list/components/Heading";
import { ProjectList } from "../components/project-list/ProjectList";
import ProjectToolbar from "../components/ProjectToolbar";
import FilterContext from "../context/FilterContext";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { FilterType } from "../types";

export const ProjectManagePage = (): JSX.Element => {
  ////////// products data
  ///////// filter
  /////////// call api

  const [searchParams, setSearchParams] = useSearchParams();

  const initialFilter =
    (searchParams.get("filter") as FilterType) || FilterType.ALL;
  const initialSearch = searchParams.get("search") || "";

  const [filter, setFilterState] = useState<FilterType>(initialFilter);
  const [search, setSearchState] = useState(initialSearch);

  useEffect(() => {
    const params: { filter?: string; search?: string } = {};
    if (filter) params.filter = filter;
    if (search) params.search = search;
    // debounce
    // useDebounce(action, time)
    setSearchParams(params);
  }, [filter, search]);

  const setFilter = (newFilter: FilterType) => {
    setFilterState(newFilter);
  };

  const setSearch = (newSearch: string) => {
    setSearchState(newSearch);
  };

  return (
    <div className={`${styles.card} ${styles.mainContent}`}>
      <Heading />
      <FilterContext.Provider value={{ filter, setFilter, search, setSearch }}>
        <ProjectToolbar />
        <ProjectList />
      </FilterContext.Provider>
    </div>
  );
};
