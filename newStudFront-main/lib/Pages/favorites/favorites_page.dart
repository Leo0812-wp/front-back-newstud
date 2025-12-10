import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:newstudapp/Pages/home/company_details.dart';
import 'package:newstudapp/Pages/widgets/company_card.dart';
import 'package:newstudapp/Pages/widgets/category_slider.dart';
import 'package:newstudapp/services/data_service.dart';
import 'package:newstudapp/config/api_config.dart';

class FavoritesPages extends StatefulWidget {
  const FavoritesPages({super.key});

  @override
  State<FavoritesPages> createState() => _FavoritesPagesState();
}

class _FavoritesPagesState extends State<FavoritesPages> {
  List<Map<String, dynamic>> buildings = [];

  @override
  void initState() {
    super.initState();
    fetchData();
  }

  Future<void> fetchData() async {
    final response = await http.get(
        Uri.parse('${ApiConfig.apiUrl}/company'));

    if (response.statusCode == 200) {
      final List<dynamic> jsonData = json.decode(response.body);
      setState(() {
        buildings = List<Map<String, dynamic>>.from(jsonData);
      });
    } else {
      throw Exception('Failed to load data');
    }
  }

  void getCompanies(List<String> categoryIds) async {
    final companies = await DataService.getCompanies(categoryIds: categoryIds);
    setState(() {
      buildings = companies;
    });
  }

  void _onCategorySelected(List<String> categoryIds) {
    getCompanies(categoryIds);
  }

  @override
  Widget build(BuildContext context) {
    String image = "assets/home/logo_bar.png";
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            const Text(
              "Différentes catégories",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 24),
            ),
            const SizedBox(height: 16),
            CategorySlider(
              onCategorySelected: _onCategorySelected,
            ),
            const SizedBox(height: 16),
            for (Map<String, dynamic> building in buildings)
              CompanyCard(
                image:
                    image, // A faire :Remplacer par la vraie image du batiment
                category: building['data']['category'] ?? 'Autre',
                description: building['data']['description'] ?? '',
                favButton: false, // active la construction du boutton favoris
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (context) =>
                          CompanyDetailsPage(building: building),
                    ),
                  );
                },
              ),
          ],
        ),
      ),
    );
  }
}
