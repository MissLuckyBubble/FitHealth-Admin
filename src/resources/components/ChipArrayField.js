import React from "react";
import { useRecordContext } from "react-admin";
import { Chip, Stack } from "@mui/material";

/**
 * Reusable component for displaying an array of string values as Material-UI Chips.
 *
 * @param {string} source - The field name that contains an array of strings
 * @returns JSX element rendering the chips
 */
const ChipArrayField = ({ source }) => {
  const record = useRecordContext();
  if (!record || !record[source]) return null;

  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
      {record[source].map((item, index) => (
        <Chip key={index} label={item} variant="outlined" />
      ))}
    </Stack>
  );
};

export default ChipArrayField;
