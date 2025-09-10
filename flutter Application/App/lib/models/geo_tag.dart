class GeoTag {
  final String id;
  final String name;
  final String type;
  final double lat;
  final double lng;
  final String status;

  GeoTag({
    required this.id,
    required this.name,
    required this.type,
    required this.lat,
    required this.lng,
    required this.status,
  });

  factory GeoTag.fromJson(Map<String, dynamic> json) => GeoTag(
    id: json["id"],
    name: json["name"],
    type: json["type"],
    lat: json["lat"],
    lng: json["lng"],
    status: json["status"],
  );
}
