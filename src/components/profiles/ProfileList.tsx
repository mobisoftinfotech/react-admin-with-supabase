import {
  Datagrid,
  DateField,
  EmailField,
  List,
  useGetIdentity,
  useRecordContext,
} from "react-admin";
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const FollowStatusField = () => {
  const record = useRecordContext();
  const { identity } = useGetIdentity();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (record?.id && identity?.id) {
      checkFollowStatus(String(record.id));
    }
  }, [record?.id, identity?.id]);

  const checkFollowStatus = async (profileId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_followers")
        .select("*")
        .eq("user_id", identity?.id)
        .eq("following_id", profileId)
        .single();

      if (error) throw error;
      setIsFollowing(!!data);
    } catch (error) {
      console.error("Error checking follow status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!identity || !record?.id || identity.id === record.id) {
    return null;
  }

  return loading ? "Loading..." : isFollowing ? "Following" : "Not Following";
};

export const ProfileList = () => (
  <List>
    <Datagrid bulkActionButtons={false}>
      <EmailField source="email" />
      <DateField source="created_at" />
      <FollowStatusField />
    </Datagrid>
  </List>
);
