import { DateInput, Edit, SimpleForm, TextInput } from "react-admin";
import { ImageUploadField } from "./ImageUploadField";
export const PostEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="title" />
      <TextInput source="content" />
      <TextInput source="user_id" style={{ display: "none" }} />
      <DateInput source="created_at" style={{ display: "none" }} />
      <ImageUploadField source="image_url" />
    </SimpleForm>
  </Edit>
);
