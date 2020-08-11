import React from "react"
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";

export default function HeaderBar() {
    return (
      <AppBar style={{ backgroundColor: "#003265" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
          />
        </Toolbar>
      </AppBar>
    )

}

