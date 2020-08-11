import React from "react"

export default function CustomContainer(props) {
    const { children } = props;
    return (
      <div
        style={{
          flexGrow: 1,
          width: "100%",
          height: "100vh",
          display: "grid",
          gridTemplateRows: "87px auto",
          backgroundColor: "#F2F2F2",
        }}
      >
        <div
          style={{
            width: "100%",
            minHeight: "calc(100% - 87px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "start",
            gridRowStart: 2,
            gridRowEnd: 2,
            marginTop: "5px",
          }}
        >
          {children}
        </div>
      </div>
    );
}