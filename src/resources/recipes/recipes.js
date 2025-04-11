// src/resources/Recipe.tsx
import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  ArrayInput,
  SimpleFormIterator,
  SelectInput,
  Create,
  required,
  CheckboxGroupInput,
  BooleanField,
} from "react-admin";
import { useEffect, useState } from "react";
import ChipArrayField from "../components/ChipArrayField";
import NutritionInfoBlock from "../components/NutritionInfoBlock";
import { Typography } from "@mui/material";

const fetchData = async (url) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error(`Failed to fetch from ${url}`);
  return response.json();
};

const useRecipeFormData = () => {
  const [enums, setEnums] = useState({ recipeTypes: [], units: [] });
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [enumData, foodData] = await Promise.all([
          fetchData("http://localhost:8080/enums"),
          fetchData("http://localhost:8080/food-items"),
        ]);
        setEnums(enumData);
        setIngredients(foodData);
      } catch (err) {
        console.error("Error loading recipe form data", err.message);
      }
    };
    load();
  }, []);

  return { enums, ingredients };
};

export const RecipeList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="macronutrients.calories" />
      <BooleanField source="verifiedByAdmin" />
      <ChipArrayField source="recipeTypes" />
      <ChipArrayField source="allergens" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const RecipeCreate = (props) => {
  const { enums, ingredients } = useRecipeFormData();
  const units = enums.units || [];

  if (!ingredients.length || !units.length || !enums.recipeTypes.length) {
    return <div>Loading...</div>;
  }

  const transform = (data) => ({
    ...data,
    recipeTypes: data.recipeTypes || [],
    ingredients: data.ingredients.map((i) => ({
      foodItem: ingredients.find((f) => f.id === i.foodItem)?.id || i.foodItem,
      quantity: i.quantity,
      unit: i.unit,
      type: "RECIPE",
    })),
  });

  return (
    <Create {...props} transform={transform}>
      <SimpleForm>
        <TextInput source="name" validate={required()} />
        <TextInput source="description" />
        <NumberInput source="preparationTime" label="Prep Time (min)" />
        <NumberInput source="cookingTime" label="Cook Time (min)" />
        <NumberInput source="servingSize" label="Servings" />

        <CheckboxGroupInput
          source="recipeTypes"
          label="Recipe Types"
          choices={enums.recipeTypes.map((rt) => ({ id: rt, name: rt }))}
        />

        <ArrayInput source="ingredients">
          <SimpleFormIterator>
            <SelectInput
              source="foodItem"
              label="Food Item"
              choices={ingredients.map((i) => ({
                id: i.id,
                name: i.name,
              }))}
              validate={required()}
            />
            <NumberInput source="quantity" validate={required()} />
            <SelectInput
              source="unit"
              choices={units.map((u) => ({ id: u, name: u }))}
              validate={required()}
            />
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Create>
  );
};

export const RecipeEdit = (props) => {
  const { enums, ingredients } = useRecipeFormData();
  const units = enums.units || [];

  if (!ingredients.length || !units.length || !enums.recipeTypes.length) {
    return <div>Loading...</div>;
  }

  const transform = (data) => ({
    ...data,
    recipeTypes: data.recipeTypes || [],
    ingredients: data.ingredients.map((i) => ({
      foodItem: i.foodItem?.id ?? i.foodItem,
      quantity: i.quantity,
      unit: i.unit,
      type: "RECIPE",
    })),
  });

  return (
    <Edit {...props} transform={transform}>
      <SimpleForm>
        <TextInput source="name" validate={required()} />
        <TextInput source="description" />
        <NumberInput source="preparationTime" />
        <NumberInput source="cookingTime" />
        <NumberInput source="servingSize" />

        <CheckboxGroupInput
          source="recipeTypes"
          label="Recipe Types"
          choices={enums.recipeTypes.map((rt) => ({ id: rt, name: rt }))}
        />

        {ingredients.length && units.length ? (
          <ArrayInput source="ingredients">
            <SimpleFormIterator>
              <SelectInput
                source="foodItem"
                label="Food Item"
                choices={ingredients.map((i) => ({
                  id: i.id,
                  name: i.name,
                }))}
                optionValue="id"
                optionText="name"
                parse={(value) => value}
                format={(value) =>
                  value && typeof value === "object" ? value.id : value
                }
                validate={required()}
              />

              <NumberInput source="quantity" validate={required()} />
              <SelectInput
                source="unit"
                label="Unit"
                choices={units.map((u) => ({ id: u, name: u }))}
                validate={required()}
              />
            </SimpleFormIterator>
          </ArrayInput>
        ) : (
          <Typography variant="body2">
            Loading ingredients and units...
          </Typography>
        )}

        <NutritionInfoBlock />
      </SimpleForm>
    </Edit>
  );
};
