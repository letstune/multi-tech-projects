
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/geo_tag.dart';

class ApiService {
  static const String baseUrl = "http://127.0.0.1:8000";

  Future<List<GeoTag>> fetchGeoTags() async {
    final response = await http.get(Uri.parse("$baseUrl/geo-tags"));
    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((e) => GeoTag.fromJson(e)).toList();
    } else {
      throw Exception("Failed to load geo-tags");
    }
  }
}
