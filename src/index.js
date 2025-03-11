import React from "react";
import ReactDOM from "react-dom";
import { Admin, Resource } from "react-admin";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme";
import dataProvider from "./dataProvider";
import authProvider from "./authProvider";

import { UserList, UserEdit, UserCreate } from "./resources/users/users";
import {
  RecipeCreate,
  RecipeEdit,
  RecipeList,
} from "./resources/recipes/recipes";
import {
  FoodItemCreate,
  FoodItemEdit,
  FoodItemList,
} from "./resources/foodItems/fooditems";
import {
  MealPlanCreate,
  MealPlanEdit,
  MealPlanList,
} from "./resources/mealplans/mealPlans";

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      theme={theme}
    >
      <Resource
        name="users"
        list={UserList}
        edit={UserEdit}
        create={UserCreate}
      />
      <Resource
        name="recipes"
        list={RecipeList}
        edit={RecipeEdit}
        create={RecipeCreate}
      />
      <Resource
        name="food-items"
        list={FoodItemList}
        edit={FoodItemEdit}
        create={FoodItemCreate}
      />

      <Resource
        name="meal-plans"
        list={MealPlanList}
        create={MealPlanCreate}
        edit={MealPlanEdit}
      />
    </Admin>
  </ThemeProvider>,
  document.getElementById("root")
);
