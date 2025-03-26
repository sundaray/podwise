import { ECSClient } from "@aws-sdk/client-ecs";

export const client = new ECSClient({
      region: "ap-south-1", 
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      }});
