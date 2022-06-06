// https://stackoverflow.com/questions/64754560/how-to-implement-material-ui-snackbar-as-a-global-function

import { useSnackbar } from "notistack";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/material/SvgIcon/SvgIcon";
import React, { useEffect, useState } from "react";

const useNotification = () => {
  const [conf, setConf] = useState({});
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    const action = (key) => (
      <>
        <IconButton
          onClick={() => {
            closeSnackbar(key);
          }}
        >
          <CloseIcon />
        </IconButton>
      </>
    );
    if (conf?.msg) {
      let variant = "info";
      if (conf.variant) {
        variant = conf.variant;
      }
      enqueueSnackbar(conf.msg, {
        variant: variant,
        autoHideDuration: 5000,
        action,
      });
    }
  }, [conf, enqueueSnackbar, closeSnackbar]);
  return [conf, setConf];
};

export default useNotification;
