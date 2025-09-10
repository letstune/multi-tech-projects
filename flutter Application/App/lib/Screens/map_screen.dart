import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:http/http.dart' as http;
import 'package:latlong2/latlong.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'dart:math';

class MapScreen extends StatelessWidget {
  const MapScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
     // appBar: AppBar(title: const Text('')),
      body: FlutterMap(
        options: const MapOptions(
          center: LatLng(23.165248, 75.770454),
          zoom: 15.0,
        ),
        children: [
          TileLayer(
            urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            userAgentPackageName: 'com.example.ujjain_map',
          ),
          MarkerLayer(

              markers: generateMarkers(context),
            ),

        ],

      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.black,
        child: const FaIcon(FontAwesomeIcons.robot,
        color: Colors.white,),
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const ChatBotScreen()),
          );
        },
      ),
    );
  }

  static Marker _buildMarker(BuildContext context, String name, double lat, double lng, IconData icon, Color color) {
    return Marker(
      width: 40,
      height: 40,
      point: LatLng(lat, lng),
      child: GestureDetector(
        onTap: () {
          showModalBottomSheet(
            context: context,
            builder: (_) => Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(name, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 12),
                  ElevatedButton.icon(
                    icon: const Icon(Icons.info_outline),
                    label: const Text("Close"),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ),
          );
        },
        child: FaIcon(icon, color: color, size: 30),
      ),
    );
  }
}


class ChatBotScreen extends StatefulWidget {
  const ChatBotScreen({super.key});

  @override
  State<ChatBotScreen> createState() => _ChatBotScreenState();
}

class _ChatBotScreenState extends State<ChatBotScreen> {
  final TextEditingController _controller = TextEditingController();
  final List<Map<String, String>> _messages = [];

  Future<void> sendMessage(String message) async {
    setState(() {
      _messages.add({'role': 'user', 'text': message});
    });

    final response = await http.post(
      Uri.parse('https://api.openai.com/v1/chat/completions'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY', // Replace with your actual key
      },
      body: jsonEncode({
        'model': 'gpt-3.5-turbo',
        'messages': [
          {'role': 'user', 'content': message}
        ],
      }),
    );

    final reply = jsonDecode(response.body);
    final botText = reply['choices'][0]['message']['content'];

    setState(() {
      _messages.add({'role': 'bot', 'text': botText});
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('ask anything about mela',
        style: TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.bold,
        ),),
        centerTitle:true,
        backgroundColor: Colors.indigo,
        elevation: 2,
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                final isUser = msg['role'] == 'user';
                return Align(
                  alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.symmetric(vertical: 6),
                    padding: const EdgeInsets.all(14),
                    constraints: const BoxConstraints(maxWidth: 300),
                    decoration: BoxDecoration(
                      color: isUser ? Colors.indigo : Colors.grey.shade200,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black12,
                          blurRadius: 4,
                          offset: Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Text(
                      msg['text'] ?? '',
                      style: TextStyle(
                        color: isUser ? Colors.white : Colors.black87,
                        fontSize: 15,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            color: Colors.white,
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    decoration: InputDecoration(
                      hintText: 'Ask something...',
                      filled: true,
                      fillColor: Colors.grey.shade100,
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(20),
                        borderSide: BorderSide.none,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Material(
                  color: Colors.indigo,
                  shape: const CircleBorder(),
                  elevation: 4,
                  child: IconButton(
                    icon: const Icon(Icons.send, color: Colors.white),
                    onPressed: () {
                      final text = _controller.text.trim();
                      if (text.isNotEmpty) {
                        sendMessage(text);
                        _controller.clear();
                      }
                    },
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}//
class LocationType {
  final String label;
  final IconData icon;
  final Color color;

  const LocationType(this.label, this.icon, this.color);
}

const List<LocationType> locationTypes = [
  LocationType("Akhada", FontAwesomeIcons.tent, Colors.deepPurple),
  LocationType("Ghat", FontAwesomeIcons.water, Colors.teal),
  LocationType("Police Booth", FontAwesomeIcons.userShield, Colors.blue),
  LocationType("Healthcare Booth", FontAwesomeIcons.briefcaseMedical, Colors.red),
  LocationType("Toilet", FontAwesomeIcons.restroom, Colors.brown),
  LocationType("Food Plaza", FontAwesomeIcons.utensils, Colors.orange),
];
List<Marker> generateMarkers(BuildContext context) {
  final List<Marker> markers = [];
  final Random random = Random();
  const double baseLat = 23.165248;
  const double baseLng =  75.770454;

  for (int i = 0; i < 50; i++) {
    final type = locationTypes[i % locationTypes.length];

    // Random offset within ±0.005 degrees (~500m)
    final latOffset = (random.nextDouble() - 0.5) * 0.01;
    final lngOffset = (random.nextDouble() - 0.5) * 0.01;

    final lat = baseLat + latOffset;
    final lng = baseLng + lngOffset;
    final name = "${type.label} ${i + 1}";

    markers.add(MapScreen._buildMarker(context, name, lat, lng, type.icon, type.color));
  }

  return markers;
}
