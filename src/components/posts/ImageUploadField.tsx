import { useCallback, useState } from "react";
import { useRecordContext, useInput, useGetIdentity } from "react-admin";
import { Box, Button, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { supabase } from "../../supabaseClient";

export const ImageUploadField = (props: { source: string }) => {
  const { source } = props;
  const record = useRecordContext();
  const { field } = useInput(props);
  const { identity } = useGetIdentity();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      try {
        setUploading(true);
        setError(null);
        const file = event.target.files?.[0];
        if (!file) return;

        if (!identity?.id) {
          throw new Error("User not authenticated");
        }

        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from("uploads")
          .upload(filePath, file, {
            upsert: true,
            cacheControl: "3600",
          });

        if (uploadError) {
          throw uploadError;
        }

        // Get signed URL (valid for 30 days)
        const { data: signedUrlData } = await supabase.storage
          .from("uploads")
          .createSignedUrl(data.path, 60 * 60 * 24 * 30);

        if (!signedUrlData) {
          throw new Error("Failed to get signed URL");
        }

        field.onChange(signedUrlData.signedUrl);
        setUploadedUrl(signedUrlData.signedUrl);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to upload image",
        );
      } finally {
        setUploading(false);
      }
    },
    [field, identity],
  );

  const imageUrl = uploadedUrl || record?.[source] || field.value;

  return (
    <Box>
      <input
        accept="image/*"
        style={{ display: "none" }}
        id="image-upload"
        type="file"
        onChange={handleFileUpload}
        disabled={uploading}
      />
      <label htmlFor="image-upload">
        <Button
          variant="contained"
          component="span"
          startIcon={<CloudUploadIcon />}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload Image"}
        </Button>
      </label>
      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      {imageUrl && (
        <Box mt={2}>
          <img
            src={imageUrl}
            alt="Uploaded"
            style={{
              maxWidth: "200px",
              maxHeight: "200px",
              objectFit: "contain",
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "4px",
            }}
            onError={(e) => {
              setError("Failed to load image");
              e.currentTarget.style.display = "none";
            }}
          />
        </Box>
      )}
    </Box>
  );
};
