import { Typography } from "@mui/material";
import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  ArrayField,
  SingleFieldList,
  ChipField,
  EditButton,
  DeleteButton,
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  Create,
  required,
  SelectArrayInput,
  ReferenceArrayInput,
  useNotify,
  useRedirect,
  useRefresh,
} from "react-admin";

export const MealPlanList = (props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <NumberField source="totalCalories" />
      <TextField source="user.username" label="User" />

      <ArrayField source="recipes">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ArrayField>

      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const MealPlanCreate = (props) => {
  const notify = useNotify();
  const redirect = useRedirect();
  const refresh = useRefresh();
  const transform = (data) => {
    return {
      name: data.name,
      recipeIds: data.recipeIds || [],
    };
  };

  return (
    <Create {...props} transform={transform}>
      <SimpleForm
        onSuccess={() => {
          notify("Meal Plan created successfully", { type: "info" });
          redirect("list", props.basePath);
          refresh();
        }}
        onFailure={(error) =>
          notify(`Error: ${error.message}`, { type: "warning" })
        }
      >
        <TextInput source="name" validate={required()} />

        <ReferenceArrayInput
          source="recipeIds"
          reference="recipes"
          label="Recipes"
          validate={required()}
        >
          <SelectArrayInput optionText="name" />
        </ReferenceArrayInput>
      </SimpleForm>
    </Create>
  );
};

export const MealPlanEdit = (props) => {
  const notify = useNotify();
  const redirect = useRedirect();
  const refresh = useRefresh();

  const transform = (data) => {
    return {
      ...data,
    };
  };

  return (
    <Edit {...props} transform={transform}>
      <SimpleForm
        onSuccess={() => {
          notify("Meal Plan updated successfully", { type: "info" });
          redirect("list", props.basePath);
          refresh();
        }}
        onFailure={(error) =>
          notify(`Error: ${error.message}`, { type: "warning" })
        }
      >
        <TextInput source="name" validate={required()} />

        {}
        <ReferenceArrayInput
          source="recipeIds"
          reference="recipes"
          label="Recipes"
          format={(value, record) => {
            if (record.recipes) {
              return record.recipes.map((r) => r.id);
            }
            return value || [];
          }}
          parse={(ids) => ids}
        >
          <SelectArrayInput optionText="name" />
        </ReferenceArrayInput>
        <Typography variant="h6">
          Total Calories:{" "}
          <NumberField source="totalCalories" label="Current Total Calories" />
        </Typography>

        <Typography variant="h6">
          Owner: <TextField source="user.username" label="User" />
        </Typography>
      </SimpleForm>
    </Edit>
  );
};
