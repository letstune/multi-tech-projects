import 'package:flutter/material.dart';
import 'dart:async';
import 'dart:ui';
import 'dart:convert';
import 'package:qr_flutter/qr_flutter.dart';
import 'package:lucide_icons/lucide_icons.dart';

class ZoneTrackerScreen extends StatefulWidget {
  const ZoneTrackerScreen({super.key});

  @override
  State<ZoneTrackerScreen> createState() => _ZoneTrackerScreenState();
}

class _ZoneTrackerScreenState extends State<ZoneTrackerScreen> {
  String currentZone = "Near ghat, Zone 2";
  DateTime? entryTime;
  Duration stayDuration = Duration.zero;
  late Timer timer;

  final List<Map<String, dynamic>> zoneHistory = [];

  // ✅ Devotee core details
  final Map<String, String> devoteeCore = {
    "Name": "Ramesh Kumar",
    "Phone": "+91 9876543210",
  };

  // ✅ Family members
  final List<Map<String, dynamic>> familyMembers = [
    {"name": "Sita", "age": "45", "gender": "Female"},
    {"name": "Rahul", "age": "20", "gender": "Male"},
  ];

  // ✅ Cached QR
  late String qrData;
  late Widget qrWidget;

  @override
  void initState() {
    super.initState();
    entryTime = DateTime.now();
    _addZoneEntry(currentZone);

    // Build full payload with family + zone info
    final Map<String, dynamic> fullPayload = {
      ...devoteeCore,
      "Family": familyMembers,
      "CurrentZone": currentZone,
      "EntryTime": entryTime!.toIso8601String(),
    };

    // Generate QR
    qrData = jsonEncode(fullPayload);
    qrWidget = RepaintBoundary(
      child: QrImageView(
        data: qrData,
        version: QrVersions.auto,
        size: 220.0,
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
      ),
    );

    timer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (entryTime != null) {
        setState(() {
          stayDuration = DateTime.now().difference(entryTime!);
        });
      }
    });
  }

  @override
  void dispose() {
    timer.cancel();
    super.dispose();
  }

  void _addZoneEntry(String zone) {
    zoneHistory.add({
      "zone": zone,
      "entry": DateTime.now(),
      "exit": null,
    });
  }

  Color getColor(Duration duration) {
    if (duration.inSeconds < 20) return Colors.greenAccent;
    if (duration.inSeconds < 40) return Colors.orangeAccent;
    return Colors.redAccent;
  }

  String getStatus(Duration duration) {
    if (duration.inSeconds < 20) return " Safe Stay";
    if (duration.inSeconds < 40) return "⚠️   Long Stay Warning";
    return "🚨 CRITICAL! Overstay";
  }

  @override
  Widget build(BuildContext context) {
    final color = getColor(stayDuration);

    return Scaffold(
      backgroundColor: Colors.black,
      body: SafeArea(
        child: Stack(
          children: [
            SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  const SizedBox(height: 80),

                  // Dashboard Card
                  _glassCard(
                    child:
                      Container(
                        width: double.infinity,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [Colors.deepPurple.shade700, Colors.black],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.4),
                              blurRadius: 12,
                              offset: Offset(0, 6),
                            ),
                          ],
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(24.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Zone / Location
                              Text(
                                "📍  $currentZone",
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 28,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: 0.8,
                                ),
                              ),
                              const SizedBox(height: 20),
                              Divider(color: Colors.white24, thickness: 1),

                              // Entry Time
                              const SizedBox(height: 16),
                              RichText(
                                text: TextSpan(
                                  children: [
                                    const TextSpan(
                                      text: "Entry Time: ",
                                      style: TextStyle(
                                        color: Colors.white70,
                                        fontSize: 18,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                    TextSpan(
                                      text: "${entryTime?.toLocal().toString().split('.')[0]}",
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ],
                                ),
                              ),

                              // Status
                              const SizedBox(height: 16),
                              RichText(
                                text: TextSpan(
                                  children: [
                                    const TextSpan(
                                      text: "Status: ",
                                      style: TextStyle(
                                        color: Colors.white70,
                                        fontSize: 18,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                    TextSpan(
                                      text: getStatus(stayDuration),
                                      style: TextStyle(
                                        color: color,
                                        fontSize: 18,
                                        fontWeight: FontWeight.bold,
                                        shadows: [
                                          Shadow(
                                            color: color.withOpacity(0.6),
                                            blurRadius: 6,
                                            offset: Offset(0, 2),
                                          ),
                                        ],
                                      ),
                                    ),
                                  ],
                                ),
                              ),

                              // Duration
                              const SizedBox(height: 16),
                              if (stayDuration != null)
                                RichText(
                                  text: TextSpan(
                                    children: [
                                      const TextSpan(
                                        text: "Duration: ",
                                        style: TextStyle(
                                          color: Colors.white70,
                                          fontSize: 18,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                      TextSpan(
                                        text: "${stayDuration.inMinutes} mins",
                                        style: const TextStyle(
                                          color: Colors.white,
                                          fontWeight: FontWeight.bold,
                                          fontSize: 18,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                            ],
                          ),
                        ),
                      )
                  ),


                  const SizedBox(height:50),

                  // Action Cards
                  GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    children: [
                      _actionCard(
                        "Zone History",
                        LucideIcons.history,
                        Colors.deepOrange,
                            () => _showHistoryDialog(context),
                      ),
              // SOS Action Card
              _actionCard(
                "SOS",
                LucideIcons.alertTriangle,
                Colors.redAccent,
                    () {
                  showDialog(
                    context: context,
                    builder: (context) {
                      return AlertDialog(
                        backgroundColor: Colors.black87,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                        title: Row(
                          children: [
                            Icon(LucideIcons.alertTriangle, color: Colors.redAccent),
                            const SizedBox(width: 8),
                            const Text(
                              "Emergency Action",
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 20,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                        content: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              "Choose your emergency response:",
                              style: TextStyle(color: Colors.white70, fontSize: 16),
                            ),
                            const SizedBox(height: 20),

                            // Call Nearest Seva Booth
                            ElevatedButton.icon(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.redAccent,
                                padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 20),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                elevation: 6,
                              ),
                              icon: const Icon(Icons.phone, color: Colors.white),
                              label: const Text(
                                "Call Nearest Seva Booth",
                                style: TextStyle(color: Colors.white, fontSize: 16),
                              ),
                              onPressed: () {
                                Navigator.pop(context);
                                callNearestSevaBooth(); // Your custom logic
                              },
                            ),

                            const SizedBox(height: 12),

                            // Random Call Type
                            ElevatedButton.icon(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.orangeAccent,
                                padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 20),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                                elevation: 6,
                              ),
                              icon: const Icon(Icons.shuffle, color: Colors.white),
                              label: const Text(
                                "Call 100",
                                style: TextStyle(color: Colors.white, fontSize: 16),
                              ),
                              onPressed: () {
                                Navigator.pop(context);
                                showRandomCallTypePopup(); // Your custom logic
                              },
                            ),
                          ],
                        ),
                      );
                    },
                  );
                },
              ),
              _actionCard(
                "Helpline",
                LucideIcons.headphones,
                Colors.blue,
                    () {
                  showDialog(
                    context: context,
                    builder: (context) {
                      return AlertDialog(
                        backgroundColor: Colors.black87,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                        title: Row(
                          children: [
                            Icon(LucideIcons.headphones, color: Colors.blueAccent),
                            const SizedBox(width: 8),
                            const Text(
                              "Helpline Directory",
                              style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                        content: SingleChildScrollView(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              _helplineTile("🍽️ Food Plaza", "1800-111-222"),
                              _helplineTile("🚓 Police Booth", "100"),
                              _helplineTile("🏥 Health Care Booth", "1800-333-444"),
                              _helplineTile("🧳 Lost & Found", "1800-555-666"),
                              _helplineTile("❓ General Queries", "1800-777-888"),
                            ],
                          ),
                        ),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(context),
                            child: const Text("Close", style: TextStyle(color: Colors.white70)),
                          ),
                        ],
                      );
                    },
                  );
                },
              ),
              _actionCard(
                "Analytics",
                LucideIcons.barChart3,
                Colors.purpleAccent,
                    () {
                  showDialog(
                    context: context,
                    builder: (context) {
                      return AlertDialog(
                        backgroundColor: Colors.black87,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                        title: Row(
                          children: [
                            Icon(LucideIcons.barChart3, color: Colors.purpleAccent),
                            const SizedBox(width: 8),
                            const Text(
                              "Live Analytics",
                              style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                        content: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            _analyticsTile("👥 Visitors Today", "${_random(1200, 2500)}"),
                            _analyticsTile("🌊 Active Ghats", "${_random(8, 15)}"),
                            _analyticsTile("🚓 Police Booths", "${_random(5, 10)}"),
                            _analyticsTile("🏥 Help Centers", "${_random(3, 7)}"),
                            _analyticsTile("📱 App Users", "${_random(5000, 10000)}"),
                            _analyticsTile("❓ Queries Resolved", "${_random(200, 600)}"),
                          ],
                        ),
                        actions: [
                          TextButton(
                            onPressed: () => Navigator.pop(context),
                            child: const Text("Close", style: TextStyle(color: Colors.white70)),
                          ),
                        ],
                      );
                    },
                  );
                },
              ),
                    ],
                  ),
                ],
              ),
            ),

            // QR Button
            Positioned(
              top: 20,
              right: 20,
              child: GestureDetector(
                onTap: () => _showQRDialog(context),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF00F5A0), Color(0xFF00D9F5)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(18),


                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: const [
                      Icon(Icons.qr_code_rounded, color: Colors.black, size: 22),
                      SizedBox(width: 8),
                      Text(
                        "My QR",
                        style: TextStyle(
                          color: Colors.black,
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          letterSpacing: 0.8,
                        ),
                      ),
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

  Widget _actionCard(String title, IconData icon, Color color, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        elevation: 6,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 40, color: color),
            const SizedBox(height: 12),
            Text(
              title,
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
          ],
        ),
      ),
    );
  }

  void _showHistoryDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: Colors.black87,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text("Zone Visit History",
            style: TextStyle(color: Colors.white)),
        content: SizedBox(
          width: double.maxFinite,
          child: ListView(
            shrinkWrap: true,
            children: zoneHistory.reversed.map((visit) {
              final entry = visit["entry"] as DateTime;
              final exit = visit["exit"] as DateTime?;
              return ListTile(
                leading: const Icon(Icons.place, color: Colors.purpleAccent),
                title: Text(visit["zone"],
                    style: const TextStyle(color: Colors.white)),
                subtitle: Text(
                  "Entry: ${entry.toLocal().toString().split('.')[0]}\n"
                      "${exit != null ? "Exit: ${exit.toLocal().toString().split('.')[0]}" : "⏳ Still inside"}",
                  style: const TextStyle(color: Colors.white70, fontSize: 12),
                ),
              );
            }).toList(),
          ),
        ),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text("Close", style: TextStyle(color: Colors.white)))
        ],
      ),
    );
  }

  void _showQRDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: Colors.black87,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            const Text("My QR Code",
                style: TextStyle(color: Colors.white, fontSize: 18)),
            const SizedBox(height: 16),
            qrWidget, // ✅ Contains devotee + family + zone info
            const SizedBox(height: 12),
            const Text("Scan for details",
                style: TextStyle(color: Colors.white70)),
          ],
        ),
      ),
    );
  }

  Widget _glassCard({required Widget child}) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(20),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.08),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: Colors.white24, width: 1),
          ),
          child: child,
        ),
      ),
    );
  }
}
void callNearestSevaBooth() {
  // TODO: Implement logic to fetch and call nearest Seva booth
  print("Calling nearest Seva booth...");
}

void showRandomCallTypePopup() {
  // TODO: Implement logic to show random call type options
  print("Showing random call type popup...");
}
Widget _helplineTile(String label, String number) {
  return Padding(
    padding: const EdgeInsets.symmetric(vertical: 8.0),
    child: Row(
      children: [
        const Icon(Icons.phone, color: Colors.white70, size: 20),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            "$label\n📞 $number",
            style: const TextStyle(color: Colors.white, fontSize: 16),
          ),
        ),
        IconButton(
          icon: const Icon(Icons.call, color: Colors.greenAccent),
          onPressed: () {
            // TODO: Add actual call logic if needed
            print("Calling $label at $number");
          },
        ),
      ],
    ),
  );
}
Widget _analyticsTile(String label, String value) {
  return Padding(
    padding: const EdgeInsets.symmetric(vertical: 6.0),
    child: Row(
      children: [
        const Icon(Icons.circle, color: Colors.white24, size: 10),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            label,
            style: const TextStyle(color: Colors.white70, fontSize: 16),
          ),
        ),
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
      ],
    ),
  );
}int _random(int min, int max) {
  return min + (max - min) * (DateTime.now().millisecond % 100) ~/ 100;
}