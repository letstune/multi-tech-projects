import 'package:flutter/material.dart';

class MapMarker extends StatelessWidget {
  final String title;
  final String subtitle;

  const MapMarker({super.key, required this.title, required this.subtitle});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const Icon(Icons.location_on, color: Colors.red, size: 32),
        Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        Text(subtitle),
      ],
    );
  }
}
