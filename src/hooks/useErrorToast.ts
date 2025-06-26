import { useEffect } from 'react';
import { toast } from 'react-toastify';

export const useErrorToast = (
  showError: boolean,
  errorMessage: string,
  errorTitle?: string
) => {
  useEffect(() => {
    if (showError && errorMessage) {
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }, [showError, errorMessage, errorTitle]);
}; 