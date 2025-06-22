import { Create, DateInput, SimpleForm, TextInput, useGetIdentity } from 'react-admin';
import { ImageUploadField } from './ImageUploadField';
            
export const PostCreate = () => {
    const { identity } = useGetIdentity();

    return (
        <Create>
            <SimpleForm
                defaultValues={{
                    user_id: identity?.id,
                    created_at: new Date().toISOString()
                }}
            >
                <TextInput source="title" required/>
                <TextInput source="content" multiline rows={4} required/>
                 <TextInput 
                    source="user_id" 
                    style={{ display: 'none' }}
                />
                <DateInput 
                    source="created_at" 
                    style={{ display: 'none' }}
                />
                <ImageUploadField source="image_url" />
            </SimpleForm>
        </Create>
    );
};