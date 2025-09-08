import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

type LoadingProps = {
  isOpen: boolean;
};

export const Loading = ({ isOpen }: LoadingProps): JSX.Element  => {
  return (
    <div>
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={isOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};
