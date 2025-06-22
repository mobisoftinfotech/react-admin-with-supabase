import {
  Datagrid,
  DateField,
  DateInput,
  ImageField,
  List,
  TextField,
  TextInput,
  DeleteButton,
  useRecordContext,
  useGetIdentity,
  useNotify,
} from "react-admin";
import { supabase } from "../../supabaseClient";

interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  image_url?: string;
}

const DeletePostButton = () => {
  const record = useRecordContext<Post>();
  const { identity } = useGetIdentity();
  const notify = useNotify();

  if (!record) return null;

  const handleDelete = async () => {
    try {
      if (record.image_url) {
        const imagePath = record.image_url.split("/").pop();
        if (imagePath) {
          await supabase.storage
            .from("uploads")
            .remove([`public/${imagePath}`]);
        }
      }

      await supabase.from("posts").delete().eq("id", record.id);

      notify("Post deleted successfully", { type: "success" });
    } catch (error) {
      console.error("Error in delete operation:", error);
      notify("Failed to delete post", { type: "error" });
      throw error;
    }
  };

  if (!identity || record.user_id !== identity.id) {
    return null;
  }

  return <DeleteButton mutationMode="pessimistic" onClick={handleDelete} />;
};

const filters = [
  <TextInput source="title" />,
  <TextInput source="content" />,
  <DateInput source="created_at" />,
];

export const PostList = () => (
  <List filters={filters}>
    <Datagrid bulkActionButtons={false}>
      <TextField source="title" />
      <TextField source="content" />
      <DateField source="created_at" />
      <ImageField source="image_url" />
      <DeletePostButton />
    </Datagrid>
  </List>
);
