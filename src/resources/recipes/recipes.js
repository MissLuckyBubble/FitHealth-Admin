// src/resources/recipes/recipes.js

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
  ReferenceInput,
  AutocompleteInput,
  Create,
  required,
  CheckboxGroupInput,
  BooleanField,
} from "react-admin";
import { useEffect, useState } from "react";
import { Typography } from "@mui/material";

const fetchData = async (url) => {
  const token = localStorage.getItem("authToken");
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${url}: ${response.status}`);
  }

  return response.json();
};

const useRecipes = () => {
  const [enums, setEnums] = useState({
    recipeTypes: [],
    units: [],
  });
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const fetchedEnums = await fetchData("http://localhost:8080/enums");

        setEnums(fetchedEnums);

        const fetchedIngredients = await fetchData(
          "http://localhost:8080/food-items"
        );
        setIngredients(fetchedIngredients);
      } catch (error) {
        console.error("Error fetching recipe data:", error.message);
      }
    };

    fetchAllData();
  }, []);
  return {
    enums,
    ingredients,
  };
};

export const RecipeList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="calories" />
      <BooleanField source="verifiedByAdmin" />
      <TextField source="recipeTypes" />
      <TextField source="allergens" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const RecipeCreate = (props) => {
  const { enums, ingredients } = useRecipes();

  if (
    enums.recipeTypes.length === 0 ||
    enums.units.length === 0 ||
    ingredients.length === 0
  ) {
    return <div>Loading...</div>;
  }

  const units = enums.units || [];

  const transform = (data) => {
    const transformedIngredients =
      data.ingredients.map((ingredient) => {
        const foodItem = ingredients.find(
          (item) => item.id === ingredient.foodItem.id
        );
        return {
          ...ingredient,
          foodItem,
        };
      }) || [];
    return {
      ...data,
      ingredients: transformedIngredients,
    };
  };

  return (
    <Create {...props} transform={transform}>
      <SimpleForm>
        <TextInput source="name" validate={required()} />
        <TextInput source="description" />
        <NumberInput source="preparationTime" />
        <NumberInput source="cookingTime" />
        <NumberInput source="servingSize" />

        <CheckboxGroupInput
          source="recipeTypes"
          choices={enums.recipeTypes.map((rt) => ({
            id: rt,
            name: rt,
          }))}
        />

        <ArrayInput source="ingredients">
          <SimpleFormIterator>
            <ReferenceInput source="foodItem" reference="food-items">
              <AutocompleteInput
                source="foodItem"
                choices={ingredients.map((item) => ({
                  id: item.id,
                  name: item.name,
                }))}
                label="Food Item"
              />
            </ReferenceInput>
            <NumberInput
              source="quantity"
              label="Quantity"
              validate={required()}
            />
            <SelectInput
              source="unit"
              choices={units.map((unit) => ({
                id: unit,
                name: unit,
              }))}
              label="Unit"
              validate={required()}
            />
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Create>
  );
};

export const RecipeEdit = (props) => {
  const { enums, ingredients } = useRecipes();

  if (
    enums.recipeTypes.length === 0 ||
    enums.units.length === 0 ||
    ingredients.length === 0
  ) {
    return <div>Loading....</div>;
  }

  const units = enums.units || [];

  const transform = (data) => {
    const transformedIngredients =
      data.ingredients?.map((ingredient) => {
        console.log(ingredient);
        const foodItem = ingredients.find(
          (item) => item.id === ingredient.foodItem.id
        );
        return {
          ...ingredient,
          foodItem: foodItem,
        };
      }) || [];

    console.log("Transformed transformedRecipeTypes:", transformedIngredients);

    return {
      ...data,
      ingredients: transformedIngredients,
    };
  };

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
          choices={enums.recipeTypes.map((rt) => ({
            id: rt,
            name: rt,
          }))}
        />

        <ArrayInput source="ingredients">
          <SimpleFormIterator>
            <ReferenceInput source="foodItem" reference="food-items">
              <AutocompleteInput
                source="foodItem.id"
                choices={ingredients.map((item) => ({
                  id: item.id,
                  name: item.name,
                }))}
                label="Food Item"
              />
            </ReferenceInput>
            <NumberInput
              source="quantity"
              label="Quantity"
              validate={required()}
            />
            <SelectInput
              source="unit"
              choices={units.map((unit) => ({
                id: unit,
                name: unit,
              }))}
              label="Unit"
              validate={required()}
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
