import * as React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { Loading } from "../../../../components/Loading";
import {
  convertToPayload,
  ProjectDetailPayload,
} from "../../types/project.dto";
import { ProjectType } from "../../types/project.model";
import type { RootState } from "../../../../store";
import { FieldError } from "../../types";
import { toast } from "react-toastify";
import { validateFormData } from "../../helpers/projectHelper";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../../store";
import ProjectService from "../../manageProjectThunk";
import styles from "./ProjectForm.module.css";
import { clearMetadataError, clearMetadataStatus } from "../../projectMetaSlice";
import { clearError, clearStatus } from "../../manageProjectSlice";
import { useParams } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { routes } from "../../../../routes/AppRouter";

const theme = createTheme({
  palette: {
    primary: {
      main: "#B8192B",
    },
  },
});

interface ProjectFormPageProps {
  isEditMode?: boolean;
}

export const ProjectFormPage = ({
  isEditMode,
}: ProjectFormPageProps): JSX.Element => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const { id } = useParams();
  const projectId = Number(id);
  const currentProject = useSelector(
    (state: RootState) => state.projects.curentProject
  );

  const detailStatus = useSelector(
    (state: RootState) => state.projects.status.detail
  );
  const metaStatus = useSelector(
    (state: RootState) => state.projectMeta.status
  );
  const metaError = useSelector((state: RootState) => state.projectMeta.error);

  React.useEffect(() => {
    if (isEditMode) {
      dispatch(ProjectService.getProjectDetail(projectId));
    }
    dispatch(ProjectService.fetchProjectMeta());
  }, [dispatch, isEditMode, projectId]);

  const hasNavigatedRef = React.useRef(false);

  React.useEffect(() => {
    if (detailStatus === "error" && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      dispatch(clearStatus("detail"));
      dispatch(clearError());
      navigate(routes.PROJECTS_PATH);
    } else if (isEditMode && currentProject) {
      setFormData(convertToPayload(currentProject));
    }
  }, [isEditMode, currentProject, detailStatus, navigate, dispatch]);

  React.useEffect(() => {
    return () => {
      dispatch(clearStatus("detail"));
    };
  }, [dispatch]);

  

  const currentTab = pathname.split("/").pop() || "general";
  const [formData, setFormData] = React.useState<ProjectDetailPayload>({
    name: "",
    code: "",
    timeStart: "",
    projectType: ProjectType.TM,
    customerId: 0,
    tasks: [],
    users: [],
    isAllUserBelongTo: false,
    projectTargetUsers: [],
  });

  React.useEffect(() => {
    if (metaError && metaStatus.fetchProjectMeta === "error") {
      toast.error(
        "Something went wrong while loading necessary data. Try again later.", {
          toastId: 'project-meta-error',
          autoClose: 3000
        });

      dispatch(clearMetadataError());
      navigate(routes.PROJECTS_PATH);
    }else if (metaError && metaStatus.saveCustomer === "error") {
      toast.error(metaError);
      dispatch(clearMetadataError());
    }
  }, [metaError, metaStatus, navigate, dispatch]);

  const handleChangeTab = (_event: React.SyntheticEvent, newValue: string) => {
    navigate(`${newValue}`);
  };

  const [errors, setErrors] = React.useState<FieldError[]>([]);

  const saveStatus = useSelector(
    (state: RootState) => state.projects.status.save
  );
  const saveError = useSelector((state: RootState) => state.projects.error);
  if (saveError && saveStatus === "error") {
    toast.error(`Error while saving data: ${saveError}`);
    dispatch(clearError());
  }
  const handleSaveData = () => {
    dispatch(ProjectService.saveProject(formData));
  };
  if (saveStatus === "success") {
    navigate(routes.PROJECTS_PATH);
    toast.success(`${isEditMode ? "Edit" : "Create"} project successfully!`);
    dispatch(clearStatus("save"));
  }

  if (metaStatus.saveCustomer === "success") {
    toast.success("Customer saved successfully!");
    dispatch(clearMetadataStatus("saveCustomer"));
  }
  const handleSubmit = () => {
    const newErrors: FieldError[] = validateFormData(formData);

    if (newErrors.length > 0) {
      setErrors(newErrors);

      toast.error(
        "Some required fields are missing or invalid. Please check and correct them."
      );
      navigate(newErrors[0].tab);

      setTimeout(() => {
        const el = document.querySelector(
          `[data-error-field="${newErrors[0].field}"]`
        );
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);

      return;
    }

    setErrors([]);
    handleSaveData();
  };


  return (
    <ThemeProvider theme={theme}>
      <div className={`${styles.card} `}>
        <Box sx={{ p: "16px 32px" }}>
          <Typography variant="h4" fontWeight="bold" mb={2}>
            {isEditMode ? "Edit" : "Create"} Project
          </Typography>

          <Tabs
            value={currentTab}
            onChange={handleChangeTab}
            textColor="primary"
            indicatorColor="primary"
            sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
          >
            <Tab label="General" value="general" />
            <Tab label="Team" value="team" />
            <Tab label="Tasks" value="tasks" />
            <Tab label="Notification" value="notification" />
          </Tabs>
          <Box
            sx={{
              minHeight: 400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {(metaStatus.fetchProjectMeta === "loading" ||
              metaStatus.saveCustomer === "loading" ||
              saveStatus === "loading" ||
              detailStatus === "loading") && <Loading isOpen />}
            {metaStatus.fetchProjectMeta === "success" && (
              <Outlet context={[formData, setFormData, errors] as const} />
            )}
          </Box>
          <Box
            mt={4}
            display="flex"
            justifyContent="flex-end"
            gap={2}
            sx={{
              position: "sticky",
              bottom: 0,
              py: 2,
              backgroundColor: "#ffffff",
              borderTop: "1px solid #e0e0e0",
              zIndex: 10,
            }}
          >
            <Button
              variant="outlined"
              sx={{ borderColor: "#b8192b", color: "#b8192b" }}
              onClick={() => navigate(routes.PROJECTS_PATH)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#b8192b" }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </div>
    </ThemeProvider>
  );
};

export default ProjectFormPage;
