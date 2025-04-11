import * as React from "react";
import {
  Typography,
  Box,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";
import { BooleanField, FunctionField, NumberField } from "react-admin";
import ChipArrayField from "./ChipArrayField";

const NutritionInfoBlock = ({ showMacros = true }) => (
  <Box sx={{ mt: 3 }}>
    <Typography variant="h6">Owner</Typography>
    <FunctionField
      label="Username"
      render={(record) => record?.owner?.username || "N/A"}
    />

    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
      Dietary Preferences
    </Typography>
    <ChipArrayField source="dietaryPreferences" />

    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
      Health Condition Suitability
    </Typography>
    <ChipArrayField source="healthConditionSuitabilities" />

    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
      Allergens
    </Typography>
    <ChipArrayField source="allergens" />

    {showMacros && (
      <>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" gutterBottom>
          Macronutrients
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableBody>
              <TableRow>
                <TableCell variant="head">Verified</TableCell>
                <TableCell>
                  <BooleanField source="verifiedByAdmin" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Calories</TableCell>
                <TableCell>
                  <NumberField source="macronutrients.calories" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Protein</TableCell>
                <TableCell>
                  <NumberField source="macronutrients.protein" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Fat</TableCell>
                <TableCell>
                  <NumberField source="macronutrients.fat" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Sugar</TableCell>
                <TableCell>
                  <NumberField source="macronutrients.sugar" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell variant="head">Salt</TableCell>
                <TableCell>
                  <NumberField source="macronutrients.salt" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </>
    )}
  </Box>
);

export default NutritionInfoBlock;
