import { NextRequest, NextResponse } from 'next/server';

// Mock routes data
const mockRoutes = [
  {
    _id: "1",
    name: "Main Entrance Route",
    from: "Parking Area A",
    to: "Main Temple",
    status: "open",
    liveMessage: "Traffic flowing normally",
    coordinates: [
      { lat: 25.4358, lng: 81.8463 },
      { lat: 25.4368, lng: 81.8473 }
    ]
  },
  {
    _id: "2", 
    name: "Side Entrance Route",
    from: "Parking Area B",
    to: "Side Temple",
    status: "congested",
    liveMessage: "Heavy traffic, expect delays",
    coordinates: [
      { lat: 25.4348, lng: 81.8453 },
      { lat: 25.4358, lng: 81.8463 }
    ]
  },
  {
    _id: "3",
    name: "Emergency Route",
    from: "Emergency Gate",
    to: "Medical Center",
    status: "closed",
    liveMessage: "Route temporarily closed for maintenance",
    coordinates: [
      { lat: 25.4338, lng: 81.8443 },
      { lat: 25.4348, lng: 81.8453 }
    ]
  },
  {
    _id: "4",
    name: "VIP Route",
    from: "VIP Entrance",
    to: "VIP Area",
    status: "open",
    liveMessage: "Clear passage for VIP vehicles",
    coordinates: [
      { lat: 25.4378, lng: 81.8483 },
      { lat: 25.4388, lng: 81.8493 }
    ]
  }
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: mockRoutes,
      message: "Routes fetched successfully"
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch routes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Handle route updates
    if (body._id) {
      const routeIndex = mockRoutes.findIndex(r => r._id === body._id);
      if (routeIndex !== -1) {
        mockRoutes[routeIndex] = { ...mockRoutes[routeIndex], ...body };
        return NextResponse.json({
          success: true,
          data: mockRoutes[routeIndex],
          message: "Route updated successfully"
        });
      }
    }
    
    // Handle new route creation
    const newRoute = {
      _id: (mockRoutes.length + 1).toString(),
      ...body
    };
    mockRoutes.push(newRoute);
    
    return NextResponse.json({
      success: true,
      data: newRoute,
      message: "Route created successfully"
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to process route" },
      { status: 500 }
    );
  }
}
