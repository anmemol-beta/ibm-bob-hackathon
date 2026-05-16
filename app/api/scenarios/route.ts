import { NextRequest, NextResponse } from "next/server";
import { generate } from "@/lib/llm";
import { getRecentCommits } from "@/lib/git";
import { GenerateScenariosRequest, GenerateScenariosResponse, HandoffScenario } from "@/lib/types";

// This is a stub API route for scenarios
// In a real implementation, this would connect to a database

export async function GET(request: NextRequest) {
  // TODO: Fetch scenarios from database
  return NextResponse.json([]);
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateScenariosRequest = await request.json();
    const { gitActivity, developerNotes, repoPath } = body;

    // If repoPath is provided, fetch git activity
    let gitContext = gitActivity || "";
    if (repoPath) {
      const result = await getRecentCommits(repoPath, 5);
      if (result.error) {
        return NextResponse.json(
          { error: `Failed to fetch git activity: ${result.error}` },
          { status: 400 }
        );
      }
      
      // Format git commits into a readable context
      gitContext = result.commits.map(commit => {
        const filesChanged = commit.changedFiles.join(", ");
        return `Commit: ${commit.message}\nAuthor: ${commit.author}\nDate: ${commit.date}\nFiles: ${filesChanged}\n`;
      }).join("\n---\n");
    }

    // Build the prompt for LLM
    const prompt = buildScenarioPrompt(gitContext, developerNotes);

    // Generate scenarios using LLM
    const llmResponse = await generate(prompt);

    // Parse the LLM response into structured scenarios
    const scenarios = parseScenarios(llmResponse);

    const response: GenerateScenariosResponse = {
      scenarios
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error generating scenarios:", error);
    return NextResponse.json(
      { error: "Failed to generate scenarios" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Update scenario in database
    
    return NextResponse.json({ message: "Scenario updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update scenario" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    // TODO: Delete scenario from database
    
    return NextResponse.json({ message: "Scenario deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete scenario" },
      { status: 500 }
    );
  }
}

/**
 * Build a prompt for the LLM to generate handoff scenarios
 */
function buildScenarioPrompt(gitActivity: string, developerNotes: string): string {
  return `You are an expert software developer analyzing a code handoff situation. Based on the recent git activity and developer notes, generate 3-5 handoff scenarios that predict situations the next developer will likely face.

Recent Git Activity:
${gitActivity || "No git activity provided"}

Developer Notes:
${developerNotes || "No notes provided"}

For each scenario, provide:
1. A clear description of the situation the next developer will likely encounter
2. A suggested approach to handle that situation

Format your response as a JSON array with this structure:
[
  {
    "situation": "Description of what the next developer will face",
    "suggestedApproach": "Recommended way to handle this situation"
  }
]

Generate 3-5 realistic scenarios based on the context provided. Focus on:
- Incomplete features that need continuation
- Potential bugs or edge cases to address
- Technical debt or refactoring opportunities
- Integration points that need attention
- Testing or documentation gaps

Respond ONLY with the JSON array, no additional text.`;
}

/**
 * Parse LLM response into structured HandoffScenario objects
 */
function parseScenarios(llmResponse: string): HandoffScenario[] {
  try {
    // Try to extract JSON from the response
    const jsonMatch = llmResponse.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      // If no JSON found, create fallback scenarios
      return createFallbackScenarios(llmResponse);
    }

    const parsed = JSON.parse(jsonMatch[0]);
    
    // Validate and transform the parsed data
    if (Array.isArray(parsed)) {
      return parsed.map((item, index) => ({
        id: `scenario-${Date.now()}-${index}`,
        situation: item.situation || "Scenario situation",
        suggestedApproach: item.suggestedApproach || "Suggested approach"
      }));
    }

    return createFallbackScenarios(llmResponse);
  } catch (error) {
    console.error("Error parsing scenarios:", error);
    return createFallbackScenarios(llmResponse);
  }
}

/**
 * Create fallback scenarios when parsing fails
 */
function createFallbackScenarios(llmResponse: string): HandoffScenario[] {
  // Split response into sections and create basic scenarios
  const sections = llmResponse.split(/\n\n+/).filter(s => s.trim().length > 20);
  
  if (sections.length === 0) {
    return [
      {
        id: `scenario-${Date.now()}-0`,
        situation: "Review recent code changes and understand the current state of the project",
        suggestedApproach: "Start by examining the git history and reading through the developer notes to get context on what was being worked on."
      },
      {
        id: `scenario-${Date.now()}-1`,
        situation: "Identify incomplete features or work in progress",
        suggestedApproach: "Look for TODO comments, incomplete test coverage, or features mentioned in notes that aren't fully implemented."
      },
      {
        id: `scenario-${Date.now()}-2`,
        situation: "Ensure the development environment is properly set up",
        suggestedApproach: "Verify all dependencies are installed, environment variables are configured, and the application runs successfully."
      }
    ];
  }

  return sections.slice(0, 5).map((section, index) => ({
    id: `scenario-${Date.now()}-${index}`,
    situation: section.substring(0, 200),
    suggestedApproach: "Review the context and determine the best approach based on project requirements and coding standards."
  }));
}

// Made with Bob
