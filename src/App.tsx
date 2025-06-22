import { Admin, Resource, CustomRoutes } from "react-admin";
import { BrowserRouter, Route } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import {
  ForgotPasswordPage,
  LoginPage,
  SetPasswordPage,
  defaultI18nProvider,
  supabaseDataProvider,
  supabaseAuthProvider,
} from "ra-supabase";
import { PostList } from "./components/posts/PostList";
import { PostCreate } from "./components/posts/PostCreate";
import { PostEdit } from "./components/posts/PostEdit";
import { ProfileList } from "./components/profiles/ProfileList";
import { ProfileShow } from "./components/profiles/ProfileShow";

const instanceUrl = import.meta.env.VITE_SUPABASE_URL;
const apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseClient = createClient(instanceUrl, apiKey);
// Configure the data provider with proper options
const dataProvider = supabaseDataProvider({
  instanceUrl,
  apiKey,
  supabaseClient,
});

// Configure the auth provider with proper options
const authProvider = supabaseAuthProvider(supabaseClient, {
  getIdentity: async () => {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error("User not found");
    }
    return {
      id: user.id,
      fullName: user.email || "",
    };
  },
});

export const App = () => (
  <BrowserRouter>
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      i18nProvider={defaultI18nProvider}
      loginPage={LoginPage}
      requireAuth
    >
      <Resource
        name="posts"
        list={PostList}
        edit={PostEdit}
        create={PostCreate}
      />
      <Resource name="profiles" list={ProfileList} show={ProfileShow} />

      <CustomRoutes noLayout>
        <Route path={SetPasswordPage.path} element={<SetPasswordPage />} />
        <Route
          path={ForgotPasswordPage.path}
          element={<ForgotPasswordPage />}
        />
      </CustomRoutes>
    </Admin>
  </BrowserRouter>
);
//code with AdminGuess

// import { AdminGuesser } from "ra-supabase";

// export const App = () => {
//   const instanceUrl = import.meta.env.VITE_SUPABASE_URL || "";
//   const apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

//   return <AdminGuesser instanceUrl={instanceUrl} apiKey={apiKey} />;
// };
