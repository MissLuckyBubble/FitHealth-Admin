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
  ArrayInput,
  SimpleFormIterator,
  required,
  BooleanField,
  Create,
  SelectInput,
  NumberInput,
  CheckboxGroupInput,
  useEditController,
} from "react-admin";
import NutritionInfoBlock from "../components/NutritionInfoBlock";

// 🔄 Load enums and components with Authorization header
const useMealData = () => {
  const [enums, setEnums] = React.useState({ recipeTypes: [], units: [] });
  const [components, setComponents] = React.useState([]);

  React.useEffect(() => {
    const token = localStorage.getItem("authToken");

    const fetchEnums = async () => {
      const res = await fetch("http://localhost:8080/enums", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error(`Failed to fetch enums: ${res.status}`);
      const data = await res.json();
      setEnums({
        recipeTypes: data.recipeTypes || [],
        units: data.units || [],
      });
    };

    const fetchComponents = async () => {
      const res = await fetch("http://localhost:8080/meal-components", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok)
        throw new Error(`Failed to fetch meal components: ${res.status}`);
      const data = await res.json();
      setComponents(data);
    };

    fetchEnums();
    fetchComponents();
  }, []);

  return { enums, components };
};

// ====== CREATE ======
export const MealCreate = (props) => {
  const { enums, components } = useMealData();

  const transform = (data) => ({
    ...data,
    mealItems: data.mealItems.map((item) => ({
      componentId: item.component.id,
      quantity: item.quantity,
      unit: item.unit,
    })),
  });

  return (
    <Create {...props} transform={transform}>
      <SimpleForm>
        <TextInput source="name" validate={required()} label="Meal Name" />
        <CheckboxGroupInput
          source="recipeTypes"
          label="Meal Types"
          choices={enums.recipeTypes.map((t) => ({ id: t, name: t }))}
          validate={required()}
        />
        <ArrayInput source="mealItems" label="Meal Items">
          <SimpleFormIterator>
            <MealItemFields components={components} units={enums.units} />
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Create>
  );
};

// ====== EDIT ======
export const MealEdit = (props) => {
  const controller = useEditController(props);
  const { record, isLoading } = controller;
  const { enums, components } = useMealData();

  const transform = (data) => ({
    ...data,
    mealItems: data.mealItems.map((item) => ({
      componentId: item.component.id,
      quantity: item.quantity,
      unit: item.unit,
    })),
  });

  if (isLoading || !record) return <span>Loading...</span>;

  return (
    <Edit {...props} transform={transform}>
      <SimpleForm>
        <TextInput source="name" validate={required()} />
        <CheckboxGroupInput
          source="recipeTypes"
          label="Meal Types"
          choices={enums.recipeTypes.map((t) => ({ id: t, name: t }))}
          validate={required()}
        />
        <ArrayInput source="mealItems" label="Meal Items">
          <SimpleFormIterator>
            <MealItemFields components={components} units={enums.units} />
          </SimpleFormIterator>
        </ArrayInput>
        <NutritionInfoBlock />
      </SimpleForm>
    </Edit>
  );
};

// ====== LIST ======
export const MealList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="recipeTypes" label="Meal Types" />
      <TextField source="visibility" />
      <NumberField source="macronutrients.calories" label="Calories" />
      <BooleanField source="verifiedByAdmin" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

// ====== MEAL ITEM FIELDS ======
const MealItemFields = ({ components, units }) => {
  if (!components.length || !units.length) {
    return <span>Loading enums...</span>;
  }

  return (
    <>
      <SelectInput
        source="component.id"
        label="Select Component"
        choices={components.map((c) => ({ id: c.id, name: c.name }))}
        validate={required()}
      />
      <NumberInput source="quantity" label="Quantity" validate={required()} />
      <SelectInput
        source="unit"
        label="Unit"
        choices={units.map((u) => ({ id: u, name: u }))}
        validate={required()}
      />
    </>
  );
};
