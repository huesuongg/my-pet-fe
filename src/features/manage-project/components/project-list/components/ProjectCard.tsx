import ProjectCardType from "../../../types/project.model";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import ActionMenu from "../../common/ActionMenu";
import { formatDateTime } from "../../../../../utils/dateUtils";
import FilterContext from "../../../context/FilterContext";
import { FilterType } from "../../../types";
import { FetchProjectPayload } from "../../../types/project.dto";
import { isBlank } from "../../../../../utils/stringUtils";
import ProjectService from "../../../manageProjectThunk";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../../store";
import { useNavigate } from "react-router-dom";
import React, { useContext } from "react";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CustomConfirmModal from "../../../../../components/CustomModal";
import ProjectDetail from "../../project-detail/ProjectDetail";

interface ProjectCardProps {
  project: ProjectCardType;
}

export const ProjectCard = ({ project }: ProjectCardProps): JSX.Element => {
  const { filter, search } = useContext(FilterContext);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [confirmState, setConfirmState] = React.useState<{
    open: boolean;
    action: "activate" | "delete" | null;
  }>({
    open: false,
    action: null,
  });

  const [openDetail, setOpenDetail] = React.useState<boolean>(false);

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

  const handleEdit = () => {
    navigate(`../projects/edit/${project.id}`);
  };

  const handleView = async () => {
    setOpenDetail(true);
  };

  const handleDelete = async () => {
    try {
      await dispatch(ProjectService.deleteProject(project.id)).unwrap();
      fetchProjects();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleActivate = async () => {
    try {
      await dispatch(ProjectService.activateProject(project)).unwrap();
      fetchProjects();
    } catch (err) {
      console.error("Activate/inactivate failed", err);
    }
  };

  const options = [
    {
      label: "Edit",
      icon: <EditIcon fontSize="small" />,
      action: handleEdit
    },
    {
      label: "View",
      icon: <VisibilityIcon fontSize="small" />,
      action: handleView
    },
    {
      label: project.status ? "Deactivate" : "Activate",
      icon: project.status ? <CloseIcon fontSize="small" /> : <CheckCircleIcon fontSize="small" />,
      action: () => setConfirmState({ open: true, action: "activate" })
    },
    {
      label: "Delete",
      icon: <DeleteIcon fontSize="small" sx={{ color: "error.main" }} />,
      action: () => setConfirmState({ open: true, action: "delete" })
    }
  ];

  const chipConfig = [
    {
      label: project.pms.join(", "),
      backgroundColor: "#d61f34",
      color: "#ffff",
      key: "pms"
    },
    {
      label: `${project.activeMember} members`,
      backgroundColor: "#399614",
      color: "#ffff",
      key: "members"
    },
    {
      label: project.code,
      backgroundColor: "#284a8d",
      color: "#ffff",
      key: "code"
    },
    {
      label: `${formatDateTime(project.timeStart)} - ${project.timeEnd ? formatDateTime(project.timeEnd) : "now"}`,
      backgroundColor: "#cc861a",
      color: "#ffff",
      key: "time"
    },
    {
      label: project.status ? "active" : "inactive",
      backgroundColor: "transparent",
      color: project.status ? "#399614" : "#d61f34",
      border: `solid 2px ${project.status ? "#399614" : "#d61f34"}`,
      variant: "outlined" as const,
      key: "status"
    }
  ];
  

  return (
    <>
      <ProjectDetail projectId={project.id} openState={[openDetail, setOpenDetail]} />
      <CustomConfirmModal
        open={confirmState.open}
        message={
          confirmState.action === "delete"
            ? "Are you sure you want to delete this project?"
            : project.status
              ? "Are you sure you want to deactivate this project?"
              : "Are you sure you want to activate this project?"
        }
        onCancel={() => {
          setConfirmState({ open: false, action: null });
        }}
        onConfirm={() => {
          if (confirmState.action === "delete") {
            handleDelete();
          } else if (confirmState.action === "activate") {
            handleActivate();
          }
          setConfirmState({ open: false, action: null });
        }}
      />
      
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Stack direction="row" spacing={2} flexWrap="wrap" rowGap={1} sx={{minWidth: "300px"}}>
          <Typography
            sx={{
              maxWidth: "300px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              color: "text.primary",
              whiteSpace: "nowrap",
              mb: 3,
            }}
          >
            {project.name}
          </Typography>

          {chipConfig.map((chip) => (
            <Chip
              key={chip.key}
              label={chip.label}
              variant={chip.variant || "filled"}
              sx={{
                backgroundColor: chip.backgroundColor,
                color: chip.color,
                border: chip.border,
              }}
              size="small"
            />
          ))}
        </Stack>
        <ActionMenu 
          options={options}
        />
      </Stack>
    </>
  );
};
