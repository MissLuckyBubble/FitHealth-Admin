import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  EditButton,
  DeleteButton,
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  DateInput,
  SelectInput,
  ArrayInput,
  SimpleFormIterator,
  required,
  Create,
} from "react-admin";
import { useEffect, useState } from "react";

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

const useEnums = () => {
  const [genders, setGenders] = useState([]);
  const [dietaryPreferences, setDietaryPreferences] = useState([]);
  const [healthConditions, setHealthConditions] = useState([]);
  const [allergens, setAllergens] = useState([]);

  useEffect(() => {
    const fetchAllEnums = async () => {
      try {
        const fetchedGenders = await fetchEnums(
          "http://localhost:8080/genders"
        );
        setGenders(fetchedGenders);

        const fetchedDietaryPreferences = await fetchEnums(
          "http://localhost:8080/preferences"
        );
        setDietaryPreferences(fetchedDietaryPreferences);

        const fetchedHealthConditions = await fetchEnums(
          "http://localhost:8080/health-conditions"
        );
        setHealthConditions(fetchedHealthConditions);

        const fetchedAllergens = await fetchEnums(
          "http://localhost:8080/allergens"
        );
        setAllergens(fetchedAllergens);
      } catch (error) {
        console.error("Error fetching enums:", error.message);
      }
    };

    fetchAllEnums();
  }, []);

  return { genders, dietaryPreferences, healthConditions, allergens };
};

export const UserList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField source="username" />
      <EmailField source="email" />
      <TextField source="role" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const UserEdit = (props) => {
  const {
    genders = [],
    dietaryPreferences = [],
    healthConditions = [],
    allergens = [],
  } = useEnums();

  const transform = (data) => {
    return {
      ...data,
      dietaryPreferences: data.dietaryPreferences || [],
      healthConditions: data.healthConditions || [],
      allergens: data.allergens || [],
    };
  };

  return (
    <Edit {...props} transform={transform}>
      <SimpleForm>
        <TextInput source="username" />
        <TextInput source="email" />
        <DateInput source="birthDate" />
        <NumberInput source="weightKG" />
        <NumberInput source="goalWeight" />
        <NumberInput source="heightCM" />
        <NumberInput source="dailyCalorieGoal" />
        <SelectInput
          source="gender"
          choices={genders.map((g) => ({ id: g, name: g }))}
        />
        <ArrayInput source="dietaryPreferences">
          <SimpleFormIterator>
            <SelectInput
              source=""
              choices={dietaryPreferences.map((dp) => ({ id: dp, name: dp }))}
            />
          </SimpleFormIterator>
        </ArrayInput>
        <ArrayInput source="healthConditions">
          <SimpleFormIterator>
            <SelectInput
              source=""
              choices={healthConditions.map((hc) => ({ id: hc, name: hc }))}
            />
          </SimpleFormIterator>
        </ArrayInput>
        <ArrayInput source="allergens">
          <SimpleFormIterator>
            <SelectInput
              source=""
              choices={allergens.map((al) => ({ id: al, name: al }))}
            />
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Edit>
  );
};
export const UserCreate = (props) => {
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput source="username" validate={required()} />
        <TextInput source="password" validate={required()} type="password" />
      </SimpleForm>
    </Create>
  );
};
