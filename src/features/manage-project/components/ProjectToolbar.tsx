import {
  Box,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { FilterType } from "../types";
import { useProjectQuantity } from "../hooks/useProjectQuantity";
import { useContext, useState, useEffect } from "react";
import { trimExtraSpaces } from "../../../utils/stringUtils";
import FilterContext from "../context/FilterContext";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../hooks/useDebounce";
import { routes } from "../../../routes/AppRouter";


export default function ProjectToolbar() {
  const { filter, setFilter, setSearch, search } = useContext(FilterContext);

  const [searchInput, setSearchInput] = useState(search);

  const { getQuantity, loading } = useProjectQuantity();

  const debouncedSearchInput = useDebounce(searchInput, 500);

  useEffect(() => {
    setSearch(trimExtraSpaces(debouncedSearchInput));
  }, [debouncedSearchInput, setSearch]);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  
  const navigate = useNavigate();
  const handleOpenForm = () => {
    navigate(routes.PROJECTS_CREATE_PATH);
  };

  return (
    <Box
      display="flex"
      gap={2}
      alignItems="center"
      margin={2}
      mb={2}
      flexWrap="wrap"
    >
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{
          minHeight: '45px',
          minWidth: "140px",
          backgroundColor: "#b8192b",
          padding: "10px",
          color: "#fff",
          textTransform: "none",
        }}
        onClick={()=> handleOpenForm()}
      >
        New Project
      </Button>

      <Select
        value={filter}
        sx={{
          minHeight: '45px',
          minWidth: "140px",
        }}
        onChange={(e) => setFilter(e.target.value as FilterType)}
        size="small"
      >
        <MenuItem value="active">
          Active Projects ({loading ? "..." : getQuantity(1)})
        </MenuItem>
        <MenuItem value="inactive">
          Inactive Projects ({loading ? "..." : getQuantity(0)})
        </MenuItem>
        <MenuItem value="all">
          All Projects ({loading ? "..." : getQuantity(1) + getQuantity(0)})
        </MenuItem>
      </Select>

      <TextField
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search by client or project name"
        size="small"
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
}
