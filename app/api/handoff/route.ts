import { NextRequest, NextResponse } from "next/server";
import { Handoff, CreateHandoffRequest, HandoffListResponse } from "@/lib/types";

// In-memory storage for handoffs (replace with database in production)
let handoffs: Handoff[] = [];

/**
 * GET /api/handoff - Retrieve all handoffs or a specific handoff by ID
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      // Get specific handoff
      const handoff = handoffs.find(h => h.id === id);
      if (!handoff) {
        return NextResponse.json(
          { error: "Handoff not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(handoff);
    }

    // Get all handoffs, sorted by timestamp (newest first)
    const sortedHandoffs = [...handoffs].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    const response: HandoffListResponse = {
      handoffs: sortedHandoffs
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching handoffs:", error);
    return NextResponse.json(
      { error: "Failed to fetch handoffs" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/handoff - Create a new handoff
 */
export async function POST(request: NextRequest) {
  try {
    const body: CreateHandoffRequest = await request.json();
    
    // Validate required fields
    if (!body.author || !body.scenarios || body.scenarios.length === 0) {
      return NextResponse.json(
        { error: "Author and at least one scenario are required" },
        { status: 400 }
      );
    }

    // Create new handoff
    const newHandoff: Handoff = {
      id: `handoff-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      author: body.author,
      timestamp: new Date(),
      gitActivitySummary: body.gitActivitySummary || "",
      scenarios: body.scenarios,
      metadata: body.metadata,
      status: 'pending'
    };

    handoffs.push(newHandoff);

    return NextResponse.json(newHandoff, { status: 201 });
  } catch (error) {
    console.error("Error creating handoff:", error);
    return NextResponse.json(
      { error: "Failed to create handoff" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/handoff - Update an existing handoff (e.g., accept it)
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, acceptedBy } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Handoff ID is required" },
        { status: 400 }
      );
    }

    const handoffIndex = handoffs.findIndex(h => h.id === id);
    if (handoffIndex === -1) {
      return NextResponse.json(
        { error: "Handoff not found" },
        { status: 404 }
      );
    }

    // Update handoff
    const updatedHandoff = { ...handoffs[handoffIndex] };
    
    if (status) {
      updatedHandoff.status = status;
    }
    
    if (acceptedBy && status === 'accepted') {
      updatedHandoff.acceptedBy = acceptedBy;
      updatedHandoff.acceptedAt = new Date();
    }

    handoffs[handoffIndex] = updatedHandoff;

    return NextResponse.json(updatedHandoff);
  } catch (error) {
    console.error("Error updating handoff:", error);
    return NextResponse.json(
      { error: "Failed to update handoff" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/handoff - Delete a handoff
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Handoff ID is required" },
        { status: 400 }
      );
    }

    const handoffIndex = handoffs.findIndex(h => h.id === id);
    if (handoffIndex === -1) {
      return NextResponse.json(
        { error: "Handoff not found" },
        { status: 404 }
      );
    }

    handoffs.splice(handoffIndex, 1);

    return NextResponse.json({ message: "Handoff deleted successfully" });
  } catch (error) {
    console.error("Error deleting handoff:", error);
    return NextResponse.json(
      { error: "Failed to delete handoff" },
      { status: 500 }
    );
  }
}

// Made with Bob