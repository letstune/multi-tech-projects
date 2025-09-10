class Devotee {
  final String userId;
  final String zoneId;
  final String entryTime;
  final String? exitTime;
  final bool alertTriggered;

  Devotee({
    required this.userId,
    required this.zoneId,
    required this.entryTime,
    this.exitTime,
    required this.alertTriggered,
  });

  factory Devotee.fromJson(Map<String, dynamic> json) => Devotee(
    userId: json["userId"],
    zoneId: json["zoneId"],
    entryTime: json["entryTime"],
    exitTime: json["exitTime"],
    alertTriggered: json["alertTriggered"] ?? false,
  );
}
