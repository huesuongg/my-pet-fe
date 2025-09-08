import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ProjectModalHeader from "./ProjectDetailHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  LinearProgress,
  Paper,
} from "@mui/material";
import { Loading } from "../../../../components/Loading";

interface ProjectDetailProps {
  projectId: number;
  openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

export const ProjectDetail = ({projectId, openState }: ProjectDetailProps): JSX.Element => {
  const [open, setOpen] = openState;

  const handleClose = () => {
    setCurrentStartDate(getStartOfWeek(new Date()));
    setOpen(false);
  };

  const [value, setValue] = React.useState("1");


  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };
  const [currentStartDate, setCurrentStartDate] = React.useState(
    getStartOfWeek(new Date())
  );

  const tasks = useSelector(
    (state: RootState) => state.projects.statistic?.tasks
  );
  const team = useSelector(
    (state: RootState) => state.projects.statistic?.team
  );

  const detailStatus = useSelector((state: RootState) => state.projects.status.detail);
  const loading = detailStatus === "loading";
  if(detailStatus==="error") handleClose();

  const formatHour = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const totalTeam = (team ?? []).reduce(
    (acc, cur) => {
      acc.totalWorkingTime += cur.totalWorkingTime;
      acc.billableWorkingTime += cur.billableWorkingTime;
      return acc;
    },
    { totalWorkingTime: 0, billableWorkingTime: 0 }
  );
  const totalTask = (tasks ?? []).reduce(
    (acc, cur) => {
      acc.totalWorkingTime += cur.totalWorkingTime;
      acc.billableWorkingTime += cur.billableWorkingTime;
      return acc;
    },
    {totalWorkingTime: 0, billableWorkingTime: 0}
  );


  const renderProgress = (used: number, total: number) => {
    const percent = total === 0 ? 0 : Math.round((used / total) * 100);
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <Box sx={{ flexGrow: 1 }}>
          <LinearProgress
            variant="determinate"
            value={percent}
            sx={{ height: 8, borderRadius: 5 }}
          />
        </Box>
        <Typography variant="body2">({percent}%)</Typography>
      </Box>
    );
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={false}
        slotProps={{
          paper: {
            component: "form",
          },
        }}
      >
        
        <Loading isOpen={loading}/>
        <ProjectModalHeader
          projectId={projectId}
          dateState={[currentStartDate, setCurrentStartDate]}
        />
        <DialogContent>
          <Box sx={{ width: "100%", typography: "body1" }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Tasks" value="1" />
                  <Tab label="Team" value="2" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Billable Task</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Hour</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Billable</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Total Row */}
                      <TableRow>
                        <TableCell>
                          <strong>Total</strong>
                        </TableCell>
                        <TableCell>
                          {formatHour(totalTask.totalWorkingTime)}
                        </TableCell>
                        <TableCell>
                          {renderProgress(
                            totalTask.billableWorkingTime,
                            totalTask.totalWorkingTime
                          )}
                        </TableCell>
                      </TableRow>

                      {tasks && tasks.map((task) => (
                        <TableRow key={task.taskId}>
                          <TableCell>{task.taskName}</TableCell>
                          <TableCell>
                            {formatHour(task.totalWorkingTime)}
                          </TableCell>
                          <TableCell>
                            {renderProgress(
                              task.billableWorkingTime,
                              task.totalWorkingTime
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>
              <TabPanel value="2">
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Name</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Hour</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Billable</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Total Row */}
                      <TableRow>
                        <TableCell>
                          <strong>Total</strong>
                        </TableCell>
                        <TableCell>
                          {formatHour(totalTeam.totalWorkingTime)}
                        </TableCell>
                        <TableCell>
                          {renderProgress(
                            totalTeam.billableWorkingTime,
                            totalTeam.totalWorkingTime
                          )}
                        </TableCell>
                      </TableRow>

                      {team && team.map((user) => (
                        <TableRow key={user.userID}>
                          <TableCell>{user.userName}</TableCell>
                          <TableCell>
                            {formatHour(user.totalWorkingTime)}
                          </TableCell>
                          <TableCell>
                            {renderProgress(
                              user.billableWorkingTime,
                              user.totalWorkingTime
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>
            </TabContext>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default ProjectDetail;
