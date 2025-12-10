import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:newstudapp/Pages/home/product_details.dart';
import 'package:newstudapp/Pages/home/widgets/product_category_slider.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:newstudapp/config/api_config.dart';

class PromotionCard extends StatelessWidget {
  final String title;
  final String description;
  final String price;
  final String imageUrl;
  final String productId;
  final VoidCallback onTapped;

  const PromotionCard({
    Key? key,
    required this.title,
    required this.description,
    required this.price,
    required this.imageUrl,
    required this.productId,
    required this.onTapped,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      child: Card(
        elevation: 4,
        child: Padding(
          padding: const EdgeInsets.all(10.0),
          child: Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.network(
                  imageUrl,
                  fit: BoxFit.cover,
                  width: 100, // Set a fixed width for consistency
                  height: 100, // Set a fixed height for consistency
                ),
              ),
              const SizedBox(width: 30),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      description,
                      style: const TextStyle(
                        color: Colors.black54,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Container(
                          decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(12)),
                          child: Text(
                            price,
                            style: const TextStyle(
                              color: Color.fromRGBO(215, 55, 56, 1),
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                        const SizedBox(width: 5),
                        ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                            backgroundColor:
                                const Color.fromRGBO(215, 55, 56, 1),
                          ),
                          onPressed: () {
                            Navigator.of(context).push(
                              MaterialPageRoute(
                                builder: (context) => ProductDetails(
                                  productId: productId,
                                ),
                              ),
                            );
                          },
                          child: const Text(
                            "J'en profite",
                            style: TextStyle(color: Colors.white),
                          ),
                        ),
                      ],
                    )
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// CompanyDetailsPage.dart
class CompanyDetailsPage extends StatefulWidget {
  final Map<String, dynamic> building;

  const CompanyDetailsPage({Key? key, required this.building})
      : super(key: key);

  @override
  State<CompanyDetailsPage> createState() => _CompanyDetailsPageState();
}

class _CompanyDetailsPageState extends State<CompanyDetailsPage> {
  List<Map<String, dynamic>> products = [];
  List<Map<String, dynamic>> filteredProducts = [];
  List<String> categories = [];
  Set<String> selectedCategories = <String>{};

  @override
  void initState() {
    super.initState();
    fetchProducts().then((_) {
      // Once products are fetched, compute categories.
      computeCategories();
    });
  }

  Future<void> fetchProducts() async {
    final String companyId = widget.building['id'].toString();
    final String url =
        '${ApiConfig.apiUrl}/products/company/$companyId';

    final response = await http.get(Uri.parse(url));
    if (response.statusCode == 200) {
      final List<dynamic> jsonData = json.decode(response.body);
      setState(() {
        products = List<Map<String, dynamic>>.from(jsonData);
        // By default, all products are shown
        filteredProducts = products;
      });
    } else {
      throw Exception('Failed to load products');
    }
  }

  void computeCategories() {
    setState(() {
      categories = products
          .map((product) => product['data']['category'] as String)
          .toSet()
          .toList();
    });
  }

  void handleProductCategorySelected(Set<String> newSelectedCategories) {
    setState(() {
      selectedCategories = newSelectedCategories;
      // Now we filter the products based on the selected categories
      if (selectedCategories.isEmpty) {
        filteredProducts.clear();
      } else {
        filteredProducts = products.where((product) {
          return selectedCategories.contains(product['data']['category']);
        }).toList();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final String buildingName =
        widget.building['data']['name'] ?? "Nom de l'établissement";
    final String productImage = widget.building['data']['urlImage'];

    final String adress = widget.building['data']['place'];

    final screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      appBar: AppBar(),
      body: SingleChildScrollView(
        child: Center(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Text(
                    buildingName,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  // const SizedBox(
                  //     width: 8), // Adds space between the text and the image
                  // GestureDetector(
                  //   onTap: () async {
                  //     final Uri googleMapsUri = Uri.parse(
                  //       "https://www.google.com/maps/search/?api=1&query=${Uri.encodeComponent(adress)}",
                  //     );

                  //     if (await canLaunchUrl(googleMapsUri)) {
                  //       await launchUrl(googleMapsUri);
                  //     } else {
                  //       print('Could not launch $googleMapsUri');
                  //       // Handle the error or inform the user if Google Maps can't be opened
                  //     }
                  //   },
                  //   child: Image.asset(
                  //     'assets/img/google_map_logo.png',
                  //     height: 35,
                  //     width: 35,
                  //   ),
                  // )
                ],
              ),
              const SizedBox(height: 8),
              SizedBox(
                width: screenWidth * 0.8,
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(20),
                  child: AspectRatio(
                    aspectRatio: 16 / 9,
                    child: Image.network(
                      productImage,
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                "Différentes catégories",
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 24),
              ),
              const SizedBox(height: 16),
              if (categories.isNotEmpty)
                ProductCategorySlider(
                  categories: categories,
                  onCategorySelected: handleProductCategorySelected,
                ),
              const SizedBox(height: 16),
              for (var product in filteredProducts)
                Container(
                  width: screenWidth * 0.9,
                  padding: const EdgeInsets.only(bottom: 10),
                  child: PromotionCard(
                    title: product['data']['name'] ?? 'nom',
                    description:
                        product['data']['description'] ?? 'description',
                    price: product['data']['priceFinal'].toString(),
                    imageUrl: product['data']['urlImageProductPage'][0],
                    productId: product['id'],
                    onTapped: () {},
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
