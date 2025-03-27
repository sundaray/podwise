import { NextResponse } from 'next/server';
import { RunTaskCommand, RunTaskCommandInput, LaunchType, AssignPublicIp } from "@aws-sdk/client-ecs";
import { client } from "@/lib/aws"

export async function POST(request: Request) {
  try { 
    const { videoId, videoTitle, podcastSlug, podcastHost } = await request.json();
    
    // Get the environment from environment variables
    const environment = process.env.DEPLOYMENT_ENVIRONMENT;
    
    // Construct resource names with the environment
    const clusterName = `ecs-cluster-podcast-summaries-${environment}`;
    const taskDefinition = `podcast-summaries-${environment}`;
    const containerName = `podcast-summaries-${environment}`;
    const s3BucketName = `podcast-summaries-${environment}`;

    // Configure the ECS RunTask command based on your infrastructure
    const input: RunTaskCommandInput = {
      cluster: clusterName,
      taskDefinition: taskDefinition,
      launchType: "FARGATE" as LaunchType,
      networkConfiguration: {   
        awsvpcConfiguration: {
          subnets: ["subnet-01401cab59270f3ab"],
          assignPublicIp: "ENABLED" as AssignPublicIp
        }
      },
      overrides: {
        containerOverrides: [
          {
            name: containerName,
            environment: [
              {
                name: "VIDEO_ID",
                value: videoId
              },
              {
                name: "VIDEO_TITLE",
                value: videoTitle
              },
              {
                name: "PODCAST_SLUG",
                value: podcastSlug
              },
              {
                name: "PODCAST_HOST",
                value: podcastHost
              },
              {
                name: "S3_BUCKET",
                value: s3BucketName
              },
              {
                name: "USER_EMAIL",
                value: process.env.USER_EMAIL
              },
              {
                name: "SUPABASE_URL",
                value: process.env.SUPABASE_URL
              },
              {
                name: "SUPABASE_SERVICE_ROLE_KEY",
                value: process.env.SUPABASE_SERVICE_ROLE_KEY
              },
              {
                name: "OPENAI_API_KEY",
                value: process.env.OPENAI_API_KEY
              },
              {
                name: "YOUTUBE_API_KEY",
                value: process.env.YOUTUBE_API_KEY
              },
              {
                name: "DEPLOYMENT_ENVIRONMENT",
                value: environment
              }
            ]
          }
        ]
      }
    };

    // Create and send the command to run the ECS task
    const command = new RunTaskCommand(input);
    const response = await client.send(command);

    console.log("ECS response: ", response)

    // Return success response with task info
    return NextResponse.json({
      success: true, 
      message: "ECS task initiated successfully",
      environment: environment
    });
  } catch (error) {
    console.error('Error starting ECS task:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to start ECS task",
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}