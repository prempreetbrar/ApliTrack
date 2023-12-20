import { Tooltip, Chip } from "@mui/material";
import useAuthContext from "hooks/useAuthContext";
import React from "react";

export default function ChipDisplayer({
  onUpdateSectionArray,
  attributeName,
  secondAttributeName,
  thirdAttributeName,
  forthAttributeTable,
  forthAttributeName,
  handleDelete,
  isContact,
}) {
  const { user } = useAuthContext();
  console.log(onUpdateSectionArray);

  return (
    <>
      {onUpdateSectionArray.map((entity, index) => (
        <Tooltip
          key={index}
          title={`${entity[attributeName]}${
            secondAttributeName ? ` - ${entity[secondAttributeName]}` : ""
          }${
            thirdAttributeName && !isContact
              ? ` - [${entity[thirdAttributeName]}]`
              : thirdAttributeName && isContact
              ? ` ${entity[thirdAttributeName]}`
              : ""
          }${
            forthAttributeName
              ? ` - (${
                  entity?.[forthAttributeTable]?.[forthAttributeName] ||
                  entity?.[forthAttributeName]
                })`
              : ""
          }`}
          arrow
          placement="top"
        >
          <Chip
            label={
              <EllipsisText>
                {entity[attributeName]}
                {secondAttributeName && ` - ${entity[secondAttributeName]}`}
                {thirdAttributeName && !isContact
                  ? ` - [${entity[thirdAttributeName]}]`
                  : thirdAttributeName && isContact
                  ? ` ${entity[thirdAttributeName]}`
                  : ""}

                {forthAttributeName
                  ? ` - (${
                      entity?.[forthAttributeTable]?.[forthAttributeName] ||
                      entity?.[forthAttributeName]
                    })`
                  : ""}
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
