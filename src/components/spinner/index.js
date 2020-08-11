import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { withStyles } from "@material-ui/core/styles";

const useStyles = () => {
  return {
    colorPrimary: {
      color: "#003265",
    },
  };
};
// eslint-disable-next-line react/prefer-stateless-function
class Loader extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: "56px",
          right: 0,
          background: "rgba(0, 0, 0, 0.15)",
          zIndex: 999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress
          classes={{
            colorPrimary: classes.colorPrimary,
          }}
        />
      </div>
    );
  }
}

export default withStyles(useStyles, { withTheme: true })(Loader);
