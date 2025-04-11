import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  Create,
  Edit,
  SimpleForm,
  TextInput,
  ReferenceInput,
  SelectInput,
  required,
  BooleanField,
} from "react-admin";
import NutritionInfoBlock from "../components/NutritionInfoBlock";

export const MealPlanList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <TextField source="breakfast.name" label="Breakfast" />
      <TextField source="lunch.name" label="Lunch" />
      <TextField source="dinner.name" label="Dinner" />
      <TextField source="snack.name" label="Snack" />
      <BooleanField source="verifiedByAdmin" />

      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

const MealReferenceInput = ({ source, label }) => (
  <ReferenceInput source={`${source}.id`} reference="meals" label={label}>
    <SelectInput optionText="name" />
  </ReferenceInput>
);

const transform = (data) => ({
  name: data.name,
  breakfast: data.breakfast?.id ? { id: data.breakfast.id } : null,
  lunch: data.lunch?.id ? { id: data.lunch.id } : null,
  dinner: data.dinner?.id ? { id: data.dinner.id } : null,
  snack: data.snack?.id ? { id: data.snack.id } : null,
});

export const MealPlanCreate = (props) => (
  <Create {...props} transform={transform}>
    <SimpleForm>
      <TextInput source="name" validate={required()} />
      <MealReferenceInput source="breakfast" label="Breakfast" />
      <MealReferenceInput source="lunch" label="Lunch" />
      <MealReferenceInput source="dinner" label="Dinner" />
      <MealReferenceInput source="snack" label="Snack" />
    </SimpleForm>
  </Create>
);

export const MealPlanEdit = (props) => (
  <Edit {...props} transform={transform}>
    <SimpleForm>
      <TextInput source="name" validate={required()} />
      <MealReferenceInput source="breakfast" label="Breakfast" />
      <MealReferenceInput source="lunch" label="Lunch" />
      <MealReferenceInput source="dinner" label="Dinner" />
      <MealReferenceInput source="snack" label="Snack" />
      <NutritionInfoBlock />
    </SimpleForm>
  </Edit>
);
