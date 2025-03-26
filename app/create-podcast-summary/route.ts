import { NextResponse } from 'next/server';
import { RunTaskCommand, RunTaskCommandInput, LaunchType, AssignPublicIp } from "@aws-sdk/client-ecs";
import {client} from "@/lib/aws"

export async function POST(request: Request) {
  try { 
    const { videoId, videoTitle, podcastSlug } = await request.json();


    // Configure the ECS RunTask command based on your infrastructure
    const input: RunTaskCommandInput = {
      cluster: "ecs-cluster-podcast-summaries-dev",
      taskDefinition: "podcast-summaries-dev",
      launchType: "FARGATE" as LaunchType,
      networkConfiguration: {
        awsvpcConfiguration: {
          subnets: ["subnet-podcast-summaries-dev"],
          assignPublicIp: "ENABLED" as AssignPublicIp
        }
      },
      overrides: {
        containerOverrides: [
          {
            name: "podcast-summaries-dev", // Container name from your task definition
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
                name: "S3_BUCKET",
                value: "podcast-summaries-dev" // S3 bucket name from your infra
              }
            ]
          }
        ]
      }
    };

    // Create and send the command to run the ECS task
    const command = new RunTaskCommand(input);
    const response = await client.send(command);

    if (!response.tasks || response.tasks.length === 0) {
      throw new Error("Failed to start ECS task");
    }

    // Return success response with task info
    return NextResponse.json({
      success: true, 
      message: "ECS task initiated successfully",
      taskArn: response.tasks[0].taskArn
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