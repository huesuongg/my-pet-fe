import React, { useContext, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../../store";
import ProjectService from "../../manageProjectThunk";
import CircularIndeterminate from "../../../../components/CircularIndeterminate";
import styles from "./ProjectList.module.css";
import { ProjectCard } from "./components/ProjectCard";
import { FilterType } from "../../types";
import FetchProjectPayload from "../../types/project.dto";
import { isBlank } from "../../../../utils/stringUtils";
import CustomAlert from "../../../../components/CustomAlert";
import { clearError, clearStatus } from "../../manageProjectSlice";
import { Loading } from "../../../../components/Loading";
import { isAnyLoading, alertConfigs } from "../../helpers/projectHelper";
import ProjectCardType from "../../types/project.model";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Divider,
} from "@mui/material";
import { toast } from "react-toastify";
import Pagination from "../../../../components/common/Pagination";
import FilterContext from "../../context/FilterContext";
import { useToast } from "../../hooks/useToast";

export const ProjectList = () => {
  const { filter, search } = useContext(FilterContext);
  const dispatch = useDispatch<AppDispatch>();
  const loadingProjects =
    useSelector((state: RootState) => state.projects.status.fetch) ===
    "loading";
  const status = useSelector((state: RootState) => state.projects.status);
  const error = useSelector((state: RootState) => state.projects.error);
  const projects = useSelector((state: RootState) => state.projects.projects);
  const { toastError } = useToast();
  const PAGE_SIZE = 10;
  const [page, setPage] = React.useState(1);

  const sortedProjects = useMemo(() => [...projects].sort((a, b) => a.customerName.localeCompare(b.customerName)), [projects]);
  const pagedProjects = useMemo(() => sortedProjects.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [sortedProjects, page, PAGE_SIZE]);
  const groupedProjects = useMemo(() => {
    return pagedProjects.reduce(
      (acc: Record<string, ProjectCardType[]>, project) => {
        const key = project.customerName;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(project);
        return acc;
      },
      {}
    );
  }, [pagedProjects]);
  const customerNames = useMemo(() => Object.keys(groupedProjects), [groupedProjects]);
  const totalPages =  useMemo (()=> Math.ceil(sortedProjects.length / PAGE_SIZE), [sortedProjects, PAGE_SIZE]);      

  useEffect(() => {
    const fetchProjects = () => {
      const data: FetchProjectPayload = {};

      if (filter === FilterType.ACTIVE) {
        data.status = 1;
      } else if (filter === FilterType.INACTIVE) {
        data.status = 0;
      }

      if (search && !isBlank(search)) {
        data.search = search;
      }

      dispatch(ProjectService.fetchProject(data));  
    };

    fetchProjects();
  }, [filter, search]);

  useEffect(() => {
    if (error) {
      toastError(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  useEffect(() => {
    alertConfigs.forEach(({ key, message }) => {
      if (status[key] === "success") {
        toast.success(message);
        dispatch(clearStatus(key));
      }
    });
  }, [status, dispatch]);

  return (
    <div className={`${styles["projects-wrapper"]}`}>
      {loadingProjects && <CircularIndeterminate />}
      <Loading
        isOpen={isAnyLoading(status, ["delete", "save", "active", "detail"])}
      />
      {!loadingProjects && projects.length === 0 && (
        <CustomAlert
          status="info"
          message={`No projects found${isBlank(search) && filter === FilterType.ALL ? "" : " for the selected filter or search term."}`}
        />
      )}
      {projects && (
        <>
          {customerNames.map(customerName => (
            <Box key={customerName} sx={{ minWidth: 275 }}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    sx={{
                      color: "text.primary",
                      margin: "-16px",
                      background: "#d8d8d8",
                      mb: 2,
                      padding: "16px",
                    }}
                  >
                    {customerName}
                  </Typography>
                  <Stack display="flex" gap={3}>
                    {groupedProjects[customerName].map((project, index) => (
                      <React.Fragment key={project.code}>
                        {index !== 0 && (
                          <Divider sx={{ border: "solid 0.15px  #09070c" }} />
                        )}
                        <ProjectCard project={project} />
                      </React.Fragment>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          ))}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(page) => setPage(page)}
            />
          )}
        </>
      )}
    </div>
  );
};
