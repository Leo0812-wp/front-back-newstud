import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:newstudapp/Pages/home/company_details.dart';
import 'package:newstudapp/Pages/home/widgets/building_card.dart';
import 'dart:convert';
import 'package:newstudapp/config/api_config.dart';

class FavoritePage extends StatefulWidget {
  final String userId;

  const FavoritePage({super.key, required this.userId});

  @override
  _FavoritePageState createState() => _FavoritePageState();
}

class _FavoritePageState extends State<FavoritePage> {
  late Future<List<dynamic>> _favoritesFuture;

  @override
  void initState() {
    super.initState();
    _favoritesFuture = fetchFavorites();
  }

  Future<List<dynamic>> fetchFavorites() async {
    final response = await http.get(
      Uri.parse(
          '${ApiConfig.apiUrl}/company/getFavorites/${widget.userId}'),
    );

    if (response.statusCode == 200) {
      List<dynamic> companyIds = json.decode(response.body)['favorites'];
      return Future.wait(
          companyIds.map((id) => fetchCompanyDetails(id)).toList());
    } else {
      throw Exception('Échec du chargement des favoris');
    }
  }

  Future<dynamic> fetchCompanyDetails(String companyId) async {
    final response = await http.get(
      Uri.parse('${ApiConfig.apiUrl}/company/$companyId'),
    );

    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Échec de la récupération des détails');
    }
  }

  void _refreshFavorites() {
    setState(() {
      _favoritesFuture = fetchFavorites();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Mes Favoris"),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: Colors.black), // Remplacer 'Colors.white' par 'Colors.black'
            onPressed: _refreshFavorites,
          )
        ],
      ),
      body: FutureBuilder<List<dynamic>>(
        future: _favoritesFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          } else if (snapshot.hasError) {
            return Center(
                child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text(
                  'Erreur lors du chargement des favoris',
                  style: TextStyle(color: Colors.red, fontSize: 18),
                ),
                const SizedBox(height: 10),
                ElevatedButton.icon(
                  onPressed: _refreshFavorites,
                  icon: const Icon(Icons.refresh),
                  label: const Text("Réessayer"),
                ),
              ],
            ));
          } else {
            return snapshot.data!.isNotEmpty
                ? ListView.builder(
                    itemCount: snapshot.data!.length,
                    itemBuilder: (context, index) {
                      final building = snapshot.data![index];
                      return BuildingCard(
                        id: building['id'],
                        image: building['data']['urlImage'] ??
                            'default_image.png',
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
                    },
                  )
                : const Center(
                    child: Padding(
                      padding: EdgeInsets.all(20),
                      child: Text(
                        'Vous n\'avez pas encore de favoris.',
                        style: TextStyle(fontSize: 18),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  );
          }
        },
      ),
    );
  }
}