import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CircularIndeterminate() {
  return (
    <Box sx={{marginBottom: '30px', display: 'flex' , justifyContent: 'center'}}>
      <CircularProgress />
    </Box>
  );
}
