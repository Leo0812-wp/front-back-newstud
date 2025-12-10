import 'package:newstudapp/services/data_service.dart';

class SearchService {
  static Future<List<Map<String, dynamic>>> searchByName(String name) async {
    final response = await DataService.getCompanies();

    List<Map<String, dynamic>> companies =
        List<Map<String, dynamic>>.from(response);

    // Filtrer les entreprises dont le nom contient la chaîne de recherche
    List<Map<String, dynamic>> filteredCompanies = companies.where((company) {
      String companyName = company['data']['name'].toString().toLowerCase();
      return companyName.contains(name.toLowerCase());
    }).toList();

    return filteredCompanies;
  }
}
