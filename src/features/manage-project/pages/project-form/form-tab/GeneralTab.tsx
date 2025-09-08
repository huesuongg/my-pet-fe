import { useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../../../store";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { ProjectType } from "../../../types/project.model";
import {
  errorEndTime,
  errorProjectCode,
  errorProjectCustomer,
  errorProjectName,
  errorStartTime,
  projectTypeLabels,
} from "../../../helpers/projectHelper";
import { CustomerPayload, ProjectDetailPayload } from "../../../types/project.dto";
import { isBlank } from "../../../../../utils/stringUtils";
import { useOutletContext } from "react-router-dom";
import { FieldError } from "../../../types";
import { useEffect, useState } from "react";
import { CustomerDialog } from "../../../components/common/CustomerDialog";
import { saveCustomer } from "../../../manageProjectThunk";
import { useDispatch } from "react-redux";

export const GeneralTab = (): JSX.Element => {
  const [formData, setFormData, errors] =
    useOutletContext<
      [
        ProjectDetailPayload,
        React.Dispatch<React.SetStateAction<ProjectDetailPayload>>,
        FieldError[],
      ]
    >();

  const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const handleChange = <K extends keyof ProjectDetailPayload>(
    field: K,
    value: ProjectDetailPayload[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getError = (field: string) => {
    return errors.find((e) => e.field === field);
  };

  const customers = useSelector(
    (state: RootState) => state.projectMeta.customers
  );

  const currentCustomer = useSelector(
    (state: RootState) => state.projectMeta.currentCustomer
  );
  useEffect(() => {
    if (currentCustomer) {
      handleChange("customerId", currentCustomer.id);
    }
  }, [currentCustomer]);

  const handleOpenCustomerDialog = () => {
    setOpenCustomerDialog(true);
  };

  const handleSaveCustomer = (data: CustomerPayload) => {
    dispatch(saveCustomer(data));
  };

  return (
    <>
      <CustomerDialog
        open={openCustomerDialog}
        onClose={() => setOpenCustomerDialog(false)}
        onSave={(data: CustomerPayload) => handleSaveCustomer(data)}
      />
      <Box sx={{ p: 3, maxWidth: 800 }}>
        <Grid container spacing={2}>
          <Grid size={8}>
            <FormControl
              fullWidth
              required
              error={
                !!getError("customerId") &&
                errorProjectCustomer(formData.customerId)
              }
            >
              <InputLabel id="client-label">Client</InputLabel>
              <Select
                labelId="client-label"
                value={formData.customerId == 0 ? "" : formData.customerId}
                label="Client"
                onChange={(e) => handleChange("customerId", e.target.value)}
              >
                {customers.map((customer) => (
                  <MenuItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </MenuItem>
                ))}
              </Select>
              <Typography
                variant="caption"
                color="error"
                sx={{ marginLeft: 1.5 }}
              >
                {errorProjectCustomer(formData.customerId)&&getError("customerId")?.message}
              </Typography>
            </FormControl>
          </Grid>
          <Grid>
            <Button 
              fullWidth variant="contained" 
              sx={{backgroundColor:"#b8192b"}}
              onClick={() => handleOpenCustomerDialog()}>
              + New Client
            </Button>
          </Grid>

          <Grid size={8}>
            <TextField
              label="Project Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              fullWidth
              required
              inputProps={{ "data-error-field": "name" }}
              error={!!getError("name") && errorProjectName(formData.name)}
              helperText={getError("name")?.message}
            />
          </Grid>
          <Grid size={8}>
            <TextField
              label="Project Code"
              value={formData.code}
              onChange={(e) => handleChange("code", e.target.value)}
              fullWidth
              required
              error={!!getError("code") && errorProjectCode(formData.code)}
              helperText={getError("code")?.message}
            />
          </Grid>

          <Grid size={12}>
            <Grid container spacing={1}>
              <Grid >
                <DatePicker
                  label="Start at"
                  value={
                    isBlank(formData.timeStart) ? null : dayjs(formData.timeStart)
                  }
                  onChange={(newValue) =>
                    handleChange(
                      "timeStart",
                      newValue ? newValue.toISOString() : ""
                    )
                  }
                  slotProps={{
                    textField: {
                      required: true,
                      error: !!getError("timeStart") && errorStartTime(formData.timeStart),
                      helperText: getError("timeStart")?.message,
                      inputProps: {
                        "data-error-field": "timeStart",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid >
                <DatePicker
                  label="End at"
                  value={formData.timeEnd ? dayjs(formData.timeEnd) : null}
                  onChange={(newValue) =>
                    handleChange(
                      "timeEnd",
                      newValue ? newValue.toISOString() : ""
                    )
                  }
                  slotProps={{
                    textField: {
                      error: !!getError("timeEnd") && errorEndTime(formData.timeStart,formData.timeEnd),
                      helperText: getError("timeEnd")?.message,
                      inputProps: {
                        "data-error-field": "timeEnd",
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid size={12}>
            <TextField
              label="Note"
              value={formData.note}
              onChange={(e) => handleChange("note", e.target.value)}
              fullWidth
              multiline
              minRows={2}
            />
          </Grid>

          <Grid>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isAllUserBelongTo}
                  onChange={(e) =>
                    handleChange("isAllUserBelongTo", e.target.checked)
                  }
                />
              }
              label="Auto add user as a member of this project when creating new user"
            />
          </Grid>

          <Grid size={12}>
            <Typography variant="subtitle1" gutterBottom>
              Project Type*
            </Typography>
            <Grid size={12}>
              <ToggleButtonGroup
                value={formData.projectType}
                exclusive
                onChange={(_, newType) =>
                  newType !== null && handleChange("projectType", newType)
                }
                fullWidth
              >
                {Object.values(ProjectType)
                  .filter((value) => typeof value === "number")
                  .map((value) => (
                    <ToggleButton key={value} value={value}>
                      {projectTypeLabels[value as ProjectType]}
                    </ToggleButton>
                  ))}
              </ToggleButtonGroup>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default GeneralTab;
