
import { toast } from "react-toastify";
import { useCallback } from "react";


export const useToast = () => {
  const toastError = useCallback(
    (error: string | Error) => {
      const errorMessage = typeof error === 'string' ? error : error.message;
      toast.error(`An error occurred: ${errorMessage}`, {
        toastId: 'project-error',
        autoClose: 3000
      });
    },
    [],
  );
    
  const toastSuccess = useCallback(
    (message: string) => {
      toast.success(message, {
        toastId: 'project-success',
        autoClose: 3000
      });
    },
    [],
  );
    

  return { toastError, toastSuccess };
};
