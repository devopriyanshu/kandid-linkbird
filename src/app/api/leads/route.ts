// app/api/leads/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { leads, campaigns } from "@/lib/schema";
import { eq, desc, ilike, or, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const campaign = searchParams.get("campaign") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = (page - 1) * limit;

    // Build the where conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(leads.name, `%${search}%`),
          ilike(leads.email, `%${search}%`),
          ilike(leads.company, `%${search}%`),
          ilike(campaigns.name, `%${search}%`)
        )
      );
    }

    if (status) {
      conditions.push(eq(leads.status, status as any));
    }

    if (campaign) {
      conditions.push(eq(campaigns.name, campaign));
    }

    // Build the main query
    const baseQuery = db
      .select({
        id: leads.id,
        name: leads.name,
        email: leads.email,
        company: leads.company,
        status: leads.status,
        lastContactDate: leads.lastContactDate,
        interactionHistory: leads.interactionHistory,
        createdAt: leads.createdAt,
        updatedAt: leads.updatedAt,
        campaignId: leads.campaignId,
        campaignName: campaigns.name,
      })
      .from(leads)
      .leftJoin(campaigns, eq(leads.campaignId, campaigns.id));

    // Apply conditions if any exist
    const query =
      conditions.length > 0 ? baseQuery.where(and(...conditions)) : baseQuery;

    // Execute query with pagination and ordering
    const result = await query
      .orderBy(desc(leads.updatedAt))
      .limit(limit)
      .offset(offset);

    // Build count query
    const baseCountQuery = db
      .select({ count: leads.id })
      .from(leads)
      .leftJoin(campaigns, eq(leads.campaignId, campaigns.id));

    // Apply same conditions to count query
    const countQuery =
      conditions.length > 0
        ? baseCountQuery.where(and(...conditions))
        : baseCountQuery;

    const totalResult = await countQuery;
    const total = totalResult.length;

    return NextResponse.json({
      success: true,
      data: result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, campaignId, status } = body;

    if (!name || !campaignId) {
      return NextResponse.json(
        { success: false, error: "Name and campaign ID are required" },
        { status: 400 }
      );
    }

    const newLead = await db
      .insert(leads)
      .values({
        name,
        email,
        company,
        campaignId,
        status: status || "Pending",
        interactionHistory: JSON.stringify([]),
      })
      .returning();

    return NextResponse.json({
      success: true,
      data: newLead[0],
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create lead" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, email, company, status, interactionHistory } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Lead ID is required" },
        { status: 400 }
      );
    }

    const updatedLead = await db
      .update(leads)
      .set({
        name,
        email,
        company,
        status,
        interactionHistory: interactionHistory
          ? JSON.stringify(interactionHistory)
          : undefined,
        lastContactDate: status === "Contacted" ? new Date() : undefined,
        updatedAt: new Date(),
      })
      .where(eq(leads.id, id))
      .returning();

    if (updatedLead.length === 0) {
      return NextResponse.json(
        { success: false, error: "Lead not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedLead[0],
    });
  } catch (error) {
    console.error("Error updating lead:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update lead" },
      { status: 500 }
    );
  }
}
