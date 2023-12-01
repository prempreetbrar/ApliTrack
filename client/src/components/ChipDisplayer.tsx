import { Tooltip, Chip } from "@mui/material";
import React from "react";

export default function ChipDisplayer({
  onUpdateSectionArray,
  attributeName,
  handleDelete,
}) {
  return (
    <>
      {onUpdateSectionArray.map((entity, index) => (
        <Tooltip
          key={index}
          title={entity[attributeName]}
          arrow
          placement="top"
        >
          <Chip
            label={<EllipsisText>{entity[attributeName]}</EllipsisText>}
            onDelete={() => handleDelete(index)}
            sx={{ marginBottom: "0.5rem", marginRight: "0.25rem" }}
          />
        </Tooltip>
      ))}
    </>
  );
}

const CHIP_MAX_WIDTH = 150;
const CHIP_ICON_WIDTH = 30;
const EllipsisText = (props) => {
  const { children } = props;

  return (
    <div
      style={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: CHIP_MAX_WIDTH - CHIP_ICON_WIDTH,
      }}
    >
      {children}
    </div>
  );
};
