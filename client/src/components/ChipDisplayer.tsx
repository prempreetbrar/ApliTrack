import { Tooltip, Chip } from "@mui/material";
import useAuthContext from "hooks/useAuthContext";
import React from "react";

export default function ChipDisplayer({
  onUpdateSectionArray,
  attributeName,
  secondAttributeName,
  thirdAttributeName,
  handleDelete,
}) {
  const { user } = useAuthContext();

  return (
    <>
      {onUpdateSectionArray.map((entity, index) => (
        <Tooltip
          key={index}
          title={`${entity[attributeName]}${
            secondAttributeName ? ` - ${entity[secondAttributeName]}` : ""
          }`}
          arrow
          placement="top"
        >
          <Chip
            label={
              <EllipsisText>
                {entity[attributeName]}
                {secondAttributeName && ` - ${entity[secondAttributeName]}`}
                {thirdAttributeName && ` ${entity[thirdAttributeName]}`}
              </EllipsisText>
            }
            onDelete={user && (() => handleDelete(index))}
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
