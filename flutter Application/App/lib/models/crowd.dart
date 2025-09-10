class Crowd {
  final String zoneId;
  final int density;
  final String timestamp;

  Crowd({required this.zoneId, required this.density, required this.timestamp});

  factory Crowd.fromJson(Map<String, dynamic> json) => Crowd(
    zoneId: json["zoneId"],
    density: json["density"],
    timestamp: json["timestamp"],
  );
}
