import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function TestScheduling() {
  const navigate = useNavigate();

  const testNavigation = () => {
    console.log("Testing navigation to doctor detail");
    navigate("/scheduling/doctor/1");
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Test Scheduling Navigation
      </Typography>
      <Button 
        variant="contained" 
        onClick={testNavigation}
        sx={{ mr: 2 }}
      >
        Test Doctor Detail Navigation
      </Button>
      <Button 
        variant="outlined" 
        onClick={() => navigate("/scheduling")}
      >
        Go to Scheduling Page
      </Button>
    </Box>
  );
}
