import {
  DateField,
  EmailField,
  Show,
  SimpleShowLayout,
  useGetIdentity,
  useRecordContext,
  Button,
} from "react-admin";
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

const FollowButton = () => {
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

  const handleFollow = async (profileId: string) => {
    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from("user_followers")
          .delete()
          .eq("user_id", identity?.id)
          .eq("following_id", profileId);

        if (error) throw error;
        setIsFollowing(false);
      } else {
        // Follow
        const { error } = await supabase.from("user_followers").insert([
          {
            user_id: identity?.id,
            following_id: profileId,
          },
        ]);

        if (error) throw error;
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
    }
  };

  if (!identity || !record?.id || identity.id === record.id) {
    return null;
  }

  return (
    <Button
      label={isFollowing ? "Unfollow" : "Follow"}
      onClick={() => handleFollow(String(record.id))}
      disabled={loading}
      color="primary"
      variant={isFollowing ? "outlined" : "contained"}
    />
  );
};

export const ProfileShow = () => (
  <Show>
    <SimpleShowLayout>
      <EmailField source="email" />
      <DateField source="created_at" />
      <FollowButton />
    </SimpleShowLayout>
  </Show>
);
