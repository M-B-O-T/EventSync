"use client";

import {Admin,Resource,List,Datagrid,TextField,NumberField,Create,SimpleForm,TextInput,DateTimeInput,
  Edit,ReferenceInput,SelectInput,ReferenceArrayInput, SelectArrayInput} from "react-admin";

import simpleRestProvider from "ra-data-simple-rest";
import authProvider from "@/lib/authProvider";

const dataProvider = simpleRestProvider("/api");


const EventList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="description" />
      <TextField source="location" />
      <TextField source="startDate" />
      <TextField source="endDate" />
    </Datagrid>
  </List>
);

const EventCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" />
      <TextInput source="description" />
      <TextInput source="location" />
      <DateTimeInput source="startDate" />
      <DateTimeInput source="endDate" />
    </SimpleForm>
  </Create>
);

const EventEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" />
      <TextInput source="description" />
      <TextInput source="location" />
      <DateTimeInput source="startDate" />
      <DateTimeInput source="endDate" />
    </SimpleForm>
  </Edit>
);


const SessionList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="title" />
      <TextField source="description" />
      <TextField source="startTime" />
      <TextField source="endTime" />
      <TextField source="event.title" />
      <TextField source="room.name" />
    </Datagrid>
  </List>
);

const SessionCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" />
      <TextInput source="description" />
      <DateTimeInput source="startTime" />
      <DateTimeInput source="endTime" />

      <ReferenceInput source="eventId" reference="events">
        <SelectInput optionText="title" />
      </ReferenceInput>

      <ReferenceInput source="roomId" reference="rooms">
        <SelectInput optionText="name" />
      </ReferenceInput>

      <ReferenceArrayInput source="speakers" reference="speakers">
        <SelectArrayInput optionText="name" />
      </ReferenceArrayInput>
    </SimpleForm>
  </Create>
);

const SessionEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" />
      <TextInput source="description" />
      <DateTimeInput source="startTime" />
      <DateTimeInput source="endTime" />

      <ReferenceInput source="eventId" reference="events">
        <SelectInput optionText="title" />
      </ReferenceInput>

      <ReferenceInput source="roomId" reference="rooms">
        <SelectInput optionText="name" />
      </ReferenceInput>

      <ReferenceArrayInput source="speakers" reference="speakers">
        <SelectArrayInput optionText="name" />
      </ReferenceArrayInput>
    </SimpleForm>
  </Edit>
);


const SpeakerList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="bio" />
      <TextField source="photoUrl" />
    </Datagrid>
  </List>
);

const SpeakerCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="photoUrl" />
      <TextInput source="bio" />
    </SimpleForm>
  </Create>
);

const SpeakerEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="photoUrl" />
      <TextInput source="bio" />
    </SimpleForm>
  </Edit>
);


const QuestionList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="content" />
      <TextField source="author" />
      <NumberField source="votes" />
      <TextField source="sessionId" />
    </Datagrid>
  </List>
);

export default function ReactAdminApp() {
  return (
    <Admin dataProvider={dataProvider} authProvider={authProvider}>
      <Resource name="events" list={EventList} create={EventCreate} edit={EventEdit} />
      <Resource name="sessions" list={SessionList} create={SessionCreate} edit={SessionEdit} />
      <Resource name="speakers" list={SpeakerList} create={SpeakerCreate} edit={SpeakerEdit} />
      <Resource name="questions" list={QuestionList} />
    </Admin>
  );
}