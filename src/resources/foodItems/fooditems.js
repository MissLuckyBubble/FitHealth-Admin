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
  ArrayField,
  SingleFieldList,
  ChipField,
} from "react-admin";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";

// Fetch data from a single endpoint for all enums
const fetchEnums = async (url) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch enums from ${url}: ${response.status}`);
  }

  return response.json();
};

// Fetch lists for food item-related enums from the /enums endpoint
const useFoodItemEnums = () => {
  const [enums, setEnums] = useState({
    allergens: [],
    dietaryPreferences: [],
    healthConditions: [],
    healthConditionSuitability: [],
    genders: [],
    recipeTypes: [],
    units: [],
  });

  useEffect(() => {
    const fetchAllEnums = async () => {
      try {
        const fetchedEnums = await fetchEnums("http://localhost:8080/enums");
        setEnums(fetchedEnums);
      } catch (error) {
        console.error("Error fetching food item enums:", error.message);
      }
    };

    fetchAllEnums();
  }, []);

  return enums;
};

export const FoodItemList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <NumberField source="caloriesPer100g" />
      <TextField source="allergens" />
      <BooleanField source="verifiedByAdmin" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const FoodItemEdit = (props) => {
  const {
    allergens = [],
    dietaryPreferences = [],
    healthConditions = [],
    healthConditionSuitability = [],
  } = useFoodItemEnums();

  const transform = (data) => {
    return {
      ...data,
      allergens: data.allergens || [],
      dietaryPreferences: data.dietaryPreferences || [],
      healthConditions: data.healthConditions || [],
      healthConditionSuitability: data.healthConditionSuitability || [],
    };
  };

  return (
    <Edit {...props} transform={transform}>
      <SimpleForm>
        <TextInput source="name" />
        <NumberInput source="caloriesPer100g" label="Calories per 100 g" />
        <NumberInput source="fatContent" />
        <NumberInput source="proteinContent" />
        <NumberInput source="sugarContent" />
        <NumberInput source="saltContent" />
        <BooleanInput
          source="verifiedByAdmin"
          defaultValue={false}
          label="Verified by Admin"
        />
        <ArrayInput source="allergens">
          <SimpleFormIterator>
            <SelectInput
              source=""
              choices={allergens.map((al) => ({ id: al, name: al }))}
            />
          </SimpleFormIterator>
        </ArrayInput>
        <Typography variant="h6">Dietary Preferences:</Typography>
        <TextField source="dietaryPreferences" />
        <Typography variant="h6">Health Condition Suitability:</Typography>
        <TextField source="healthConditionSuitability" />
        <Typography variant="h6">
          Owner username:{" "}
          <TextField source="owner.username" label="Owner username" />
        </Typography>
      </SimpleForm>
    </Edit>
  );
};

export const FoodItemCreate = (props) => {
  const { allergens = [] } = useFoodItemEnums();

  const transform = (data) => {
    return {
      ...data,
      allergens: data.allergens || [],
    };
  };

  return (
    <Create {...props} transform={transform}>
      <SimpleForm>
        <TextInput source="name" validate={required()} />
        <NumberInput source="caloriesPer100g" validate={required()} />
        <NumberInput source="fatContent" />
        <NumberInput source="proteinContent" />
        <NumberInput source="sugarContent" />
        <NumberInput source="saltContent" />
        <ArrayInput source="allergens">
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
