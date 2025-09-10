class LostFound {
  final String reportId;
  final String type;
  final String imageUrl;
  final String description;
  final String status;

  LostFound({
    required this.reportId,
    required this.type,
    required this.imageUrl,
    required this.description,
    required this.status,
  });

  factory LostFound.fromJson(Map<String, dynamic> json) => LostFound(
    reportId: json["reportId"],
    type: json["type"],
    imageUrl: json["imageUrl"],
    description: json["description"],
    status: json["status"],
  );
}
