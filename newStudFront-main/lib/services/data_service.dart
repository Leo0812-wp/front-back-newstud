import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:newstudapp/Pages/widgets/category_slider.dart';
import 'package:newstudapp/config/api_config.dart';

class DataService {
  static Future<List<Category>> getCompanyCategories() async {
    String apiUrl = "${ApiConfig.apiUrl}/companyCategory";

    final response = await http.get(Uri.parse(apiUrl));
    if (response.statusCode == 200) {
      List<dynamic> categoryJson = json.decode(response.body);
      return categoryJson.map((json) => Category.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load categories');
    }
  }

  static Future<List<Map<String, dynamic>>> getCompanies(
      {List<String> categoryIds = const []}) async {
    String url = '${ApiConfig.apiUrl}/company';
    List<Map<String, dynamic>> fetchedCompanies = [];
    // Recherche par categories
    if (categoryIds.isNotEmpty) {
      for (var categoryId in categoryIds) {
        url += "/category/$categoryId";
        final response = await http.get(Uri.parse(url));
        if (response.statusCode == 200) {
          final List<dynamic> jsonData = json.decode(response.body);
          fetchedCompanies.addAll(List<Map<String, dynamic>>.from(jsonData));
        } else {
          throw Exception('Failed to load data');
        }
      }
    } else {
      // Liste toute les companies
      final response = await http.get(Uri.parse(url));
      if (response.statusCode == 200) {
        final List<dynamic> jsonData = json.decode(response.body);
        fetchedCompanies.addAll(List<Map<String, dynamic>>.from(jsonData));
      } else {
        throw Exception('Failed to load data');
      }
    }
    return fetchedCompanies;
  }
}
