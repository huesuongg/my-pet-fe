import {
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import { ProjectDetailPayload } from "../../../types/project.dto";
import { FieldError } from "../../../types";

export const NotificationTab = (): JSX.Element => {
  const [formData, setFormData] =
    useOutletContext<
      [
        ProjectDetailPayload,
        React.Dispatch<React.SetStateAction<ProjectDetailPayload>>,
        FieldError[]
      ]
    >();

  const handleChange = <K extends keyof ProjectDetailPayload>(
    field: K,
    value: ProjectDetailPayload[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };


  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={2} direction="column">
        <Grid>
          <TextField
            label="Komu Channel Id"
            value={formData.komuChannelId ?? ""}
            onChange={(e) => handleChange("komuChannelId", e.target.value)}
            fullWidth
          />
        </Grid>

        <Grid>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isNotifyToKomu ?? false}
                onChange={(e) =>
                  handleChange("isNotifyToKomu", e.target.checked)
                }
              />
            }
            label={
              <Typography fontWeight="bold">Submit timesheet</Typography>
            }
          />
        </Grid>

        <Grid>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isNoticeKMRequestOffDate ?? false}
                onChange={(e) =>
                  handleChange("isNoticeKMRequestOffDate", e.target.checked)
                }
              />
            }
            label={
              <Typography fontWeight="bold">
                Request Off/Remote/Onsite
              </Typography>
            }
          />
        </Grid>

        <Grid>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isNoticeKMApproveRequestOffDate ?? false}
                onChange={(e) =>
                  handleChange(
                    "isNoticeKMApproveRequestOffDate",
                    e.target.checked
                  )
                }
              />
            }
            label={
              <Typography fontWeight="bold">
                Approve/Reject Request Off/Remote/Onsite
              </Typography>
            }
          />
        </Grid>

        <Grid>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isNoticeKMRequestChangeWorkingTime ?? false}
                onChange={(e) =>
                  handleChange(
                    "isNoticeKMRequestChangeWorkingTime",
                    e.target.checked
                  )
                }
              />
            }
            label={
              <Typography fontWeight="bold">
                Request Change Working Time
              </Typography>
            }
          />
        </Grid>

        <Grid>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.isNoticeKMApproveChangeWorkingTime ?? false}
                onChange={(e) =>
                  handleChange(
                    "isNoticeKMApproveChangeWorkingTime",
                    e.target.checked
                  )
                }
              />
            }
            label={
              <Typography fontWeight="bold">
                Approve/Reject Change Working Time
              </Typography>
            }
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default NotificationTab;
