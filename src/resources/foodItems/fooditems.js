import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  EditButton,
  DeleteButton,
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  SelectInput,
  ArrayInput,
  SimpleFormIterator,
  required,
  Create,
  BooleanInput,
  BooleanField,
} from "react-admin";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import ChipArrayField from "../components/ChipArrayField";
import NutritionInfoBlock from "../components/NutritionInfoBlock";

// API enum fetch
const fetchEnums = async (url) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error(`Failed to fetch enums`);
  return response.json();
};

const useFoodItemEnums = () => {
  const [enums, setEnums] = useState({ allergens: [] });
  useEffect(() => {
    fetchEnums("http://localhost:8080/enums")
      .then(setEnums)
      .catch((e) => console.error("Enum fetch failed", e));
  }, []);
  return enums;
};

export const FoodItemList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <NumberField source="macronutrients.calories" label="Calories" />
      <ChipArrayField source="allergens" />
      <BooleanField source="verifiedByAdmin" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const FoodItemEdit = (props) => {
  const { allergens = [] } = useFoodItemEnums();
  const transform = (data) => ({
    ...data,
    allergens: data.allergens || [],
    type: "FOOD_ITEM",
  });

  return (
    <Edit {...props} transform={transform}>
      <SimpleForm>
        <TextInput source="name" validate={required()} />

        <Typography variant="h6">Macronutrients</Typography>
        <NumberInput source="macronutrients.calories" label="Calories" />
        <NumberInput source="macronutrients.protein" label="Protein" />
        <NumberInput source="macronutrients.fat" label="Fat" />
        <NumberInput source="macronutrients.sugar" label="Sugar" />
        <NumberInput source="macronutrients.salt" label="Salt" />

        <BooleanInput
          source="verifiedByAdmin"
          defaultValue={false}
          label="Verified by Admin"
        />

        {allergens.length > 0 ? (
          <ArrayInput source="allergens" label="Allergens">
            <SimpleFormIterator>
              <SelectInput
                source=""
                choices={allergens.map((al) => ({ id: al, name: al }))}
              />
            </SimpleFormIterator>
          </ArrayInput>
        ) : (
          <Typography variant="body2">Loading allergens...</Typography>
        )}

        <NutritionInfoBlock />
      </SimpleForm>
    </Edit>
  );
};

export const FoodItemCreate = (props) => {
  const { allergens = [] } = useFoodItemEnums();
  const transform = (data) => ({
    ...data,
    allergens: data.allergens || [],
    type: "FOOD_ITEM",
  });

  return (
    <Create {...props} transform={transform}>
      <SimpleForm>
        <TextInput source="name" validate={required()} />

        <Typography variant="h6">Macronutrients</Typography>
        <NumberInput source="macronutrients.calories" label="Calories" />
        <NumberInput source="macronutrients.protein" label="Protein" />
        <NumberInput source="macronutrients.fat" label="Fat" />
        <NumberInput source="macronutrients.sugar" label="Sugar" />
        <NumberInput source="macronutrients.salt" label="Salt" />

        <BooleanInput
          source="verifiedByAdmin"
          defaultValue={false}
          label="Verified by Admin"
        />

        <ArrayInput source="allergens" label="Allergens">
          <SimpleFormIterator>
            <SelectInput
              source=""
              choices={allergens.map((al) => ({ id: al, name: al }))}
            />
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Create>
  );
};
