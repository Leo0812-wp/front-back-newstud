import 'package:flutter/material.dart';
import 'package:newstudapp/Pages/home/company_details.dart';
import 'package:newstudapp/Pages/home/widgets/building_card.dart';
import 'package:newstudapp/services/data_service.dart';
import '../widgets/category_slider.dart';
import 'widgets/reduction_box.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  // ignore: library_private_types_in_public_api
  _HomePageState createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  List<Map<String, dynamic>> buildings = [];

  @override
  void initState() {
    getCompanies([]);
    super.initState();
  }

  void getCompanies(List<String> categoryIds) async {
  final companies = await DataService.getCompanies();
  print("Toutes les entreprises récupérées : $companies");  // Afficher les entreprises pour vérifier

  setState(() {
    if (categoryIds.isEmpty) {
      buildings = companies;  // Si aucune catégorie sélectionnée, on affiche tout
    } else {
      // Filtrer les bâtiments pour ne garder que ceux ayant les bonnes catégories
      buildings = companies.where((building) {
        final category = building['data']['category'];  // Utiliser 'category' et non 'name'
        return categoryIds.contains(category);
      }).toList();
    }
  });

  print("Bâtiments après filtrage : $buildings");  // Afficher les bâtiments après filtrage
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
            const ReductionBox(),
            const SizedBox(height: 16),
            const Text(
              "Différentes catégories",
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 24),
            ),
            const SizedBox(height: 16),
            CategorySlider(
              onCategorySelected: _onCategorySelected,
            ),
            const SizedBox(height: 16),
            buildings.isNotEmpty
                ? Column(
                    children: buildings.map<Widget>((building) {
                      return BuildingCard(
                        id: building['id'],
                        image: building['data']['urlImage'] ?? image,
                        category: building['data']['name'] ?? 'Autre',
                        description: building['data']['description'] ?? '',
                        onPressed: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (context) =>
                                  CompanyDetailsPage(building: building),
                            ),
                          );
                        },
                      );
                    }).toList(),
                  )
                : const Card(
                    margin: EdgeInsets.all(20),
                    child: Padding(
                      padding: EdgeInsets.all(16),
                      child: Text(
                        'Aucun établissement ne correspond à votre sélection',
                        style: TextStyle(fontSize: 18),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
          ],
        ),
      ),
    );
  }
}
