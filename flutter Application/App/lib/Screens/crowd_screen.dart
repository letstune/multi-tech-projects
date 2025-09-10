import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

class CrowdMapScreen extends StatefulWidget {
  const CrowdMapScreen({super.key});

  @override
  State<CrowdMapScreen> createState() => _CrowdMapScreenState();
}

class _CrowdMapScreenState extends State<CrowdMapScreen> {
  bool isFullMap = false;

  // Hardcoded zones for demo
  final List<Map<String, dynamic>> crowdData = [
    {
      "name": "Ram Ghat",
      "lat": 23.1665,
      "lng": 75.7720,
      "density": 80
    },
    {
      "name": "Shipra Ghat",
      "lat": 23.1640,
      "lng": 75.7690,
      "density": 75
    },
    {
      "name": "Zone 4",
      "lat": 23.1685,
      "lng": 75.7750,
      "density": 50
    },
    {
      "name": "Zone 6",
      "lat": 23.1625,
      "lng": 75.7675,
      "density": 60
    },
    {
      "name": "Zone 8",
      "lat": 23.1700,
      "lng": 75.7715,
      "density": 5
    },
    {
      "name": "Triveni Ghat",
      "lat": 23.1655,
      "lng": 75.7740,
      "density": 15
    }
  ];

  Color _getColor(int density) {
    if (density < 25) return Colors.green;
    if (density < 50) return Colors.yellow;
    if (density < 75) return Colors.orange;
    return Colors.red;
  }

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.of(context).size;

    final congestedZones =
    crowdData.where((z) => (z["density"] ?? 0) >= 75).toList();
    final safeZones =
    crowdData.where((z) => (z["density"] ?? 0) < 25).toList();
    final moderateZones = crowdData
        .where((z) =>
    (z["density"] ?? 0) >= 25 && (z["density"] ?? 0) < 75)
        .toList();

    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Column(
          children: [
            // Map section
            GestureDetector(
              onTap: () => setState(() => isFullMap = !isFullMap),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 400),
                height: isFullMap ? size.height * 0.85 : size.height * 0.45,
                width: double.infinity,
                child: FlutterMap(
                  options: MapOptions(
                    initialCenter: LatLng(23.165248, 75.770454),
                    initialZoom: 15,
                  ),
                  children: [
                    TileLayer(
                      urlTemplate:
                      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                      userAgentPackageName: 'com.example.app',
                    ),
                    CircleLayer(
                      circles: crowdData.map((spot) {
                        final color = _getColor(spot["density"]);
                        return CircleMarker(
                          point: LatLng(spot["lat"], spot["lng"]),
                          radius: 60, // Adjust size
                          color: color.withOpacity(0.3),
                          borderStrokeWidth: 2,
                          borderColor: color,
                        );
                      }).toList(),
                    ),
                    MarkerLayer(
                      markers: crowdData.map((spot) {
                        return Marker(
                          point: LatLng(spot["lat"], spot["lng"]),
                          width: 120,
                          height: 50,
                          child: Column(
                            children: [
                              Icon(Icons.location_on,
                                  color: _getColor(spot["density"]), size: 30),
                              Text(
                                spot["name"],
                                style: const TextStyle(
                                    fontSize: 12, color: Colors.black),
                              )
                            ],
                          ),
                        );
                      }).toList(),
                    )
                  ],
                ),
              ),
            ),

            // Dashboard (hidden if fullscreen map)
            if (!isFullMap)
              Expanded(
                child: Container(
                  width: double.infinity,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.1),
                    borderRadius:
                    const BorderRadius.vertical(top: Radius.circular(20)),
                    border: Border.all(color: Colors.white24),
                  ),
                  padding:
                  const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                  child: SingleChildScrollView(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text("📊 Crowd Dashboard",
                            style: TextStyle(
                                color: Colors.white,
                                fontSize: 20,
                                fontWeight: FontWeight.bold)),
                        const SizedBox(height: 16),

                        _zoneCard("🚨 Congested Zones",
                            zones: congestedZones, color: Colors.red),
                        const SizedBox(height: 12),

                        _zoneCard("🟠 Moderate Zones",
                            zones: moderateZones, color: Colors.orange),
                        const SizedBox(height: 12),

                        _zoneCard("✅ Safe Zones",
                            zones: safeZones, color: Colors.green),
                        const SizedBox(height: 16),

                        const Center(
                          child: Text(
                            "Tap on the map to expand fullscreen 🔍",
                            style: TextStyle(color: Colors.white70),
                          ),
                        )
                      ],
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _zoneCard(String title,
      {required List<Map<String, dynamic>> zones, required Color color}) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.4)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title,
              style: TextStyle(
                  color: color, fontSize: 16, fontWeight: FontWeight.bold)),
          const SizedBox(height: 6),
          zones.isEmpty
              ? const Text("None",
              style: TextStyle(color: Colors.black, fontSize: 14,
              fontWeight: FontWeight.bold),)
              : Wrap(
            spacing: 8,
            children: zones
                .map((z) => Chip(
              label: Text("${z["name"
                  ]} (${z["density"]}%)"),
              backgroundColor: color.withOpacity(0.2),
              labelStyle: const TextStyle(color: Colors.black,
              fontWeight: FontWeight.bold),
            ))
                .toList(),
          )
        ],
      ),
    );
  }
}
