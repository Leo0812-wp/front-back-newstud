import 'dart:convert';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:newstudapp/Pages/home/widgets/product_image_slider.dart';
import 'package:newstudapp/Pages/home/widgets/pop_up_voucher.dart';
import 'package:newstudapp/config/api_config.dart';

class ProductDetails extends StatefulWidget {
  final String productId;

  const ProductDetails({Key? key, required this.productId}) : super(key: key);

  @override
  // ignore: library_private_types_in_public_api
  _ProductDetailsState createState() => _ProductDetailsState();
}

String getCurrentUserId() {
  final FirebaseAuth auth = FirebaseAuth.instance;
  final User? user = auth.currentUser;
  final String uid = user?.uid ?? '';

  return uid;
}

class _ProductDetailsState extends State<ProductDetails> {
  late Future<Product> futureProduct;
  String voucherId = "";

  @override
  void initState() {
    super.initState();
    futureProduct = fetchProduct(widget.productId);

    String userId = getCurrentUserId();
    askVoucher(userId, widget.productId);
  }

  Future<void> askVoucher(String userId, String productId) async {
    final url = Uri.parse('${ApiConfig.apiUrl}/vouchers/askVouchers');
    
    try {
      final response = await http.post(url, body: {
        'productId': productId,
        'userId': userId,
      });

      if (response.statusCode == 200) {
        final responseData = json.decode(response.body);
        String fetchedVoucherValue = responseData['voucherValue'];
        
        setState(() {
          voucherId = fetchedVoucherValue;
        });
        
      } else {
        print('Erreur : ${response.statusCode}');
        return;
      }
    } catch (error) {
      print('Exception : $error');
      return;
    }
  }

  Future<Product> fetchProduct(String productId) async {
    final response = await http.get(
      Uri.parse(
          '${ApiConfig.apiUrl}/products/$productId'),
    );

    if (response.statusCode == 200) {
      // If server returns an OK response, parse the JSON.
      return Product.fromJson(json.decode(response.body));
    } else {
      // If the server did not return a 200 OK response,
      // throw an exception.
      throw Exception('Failed to load product');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),
      body: FutureBuilder<Product>(
        future: futureProduct,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.done) {
            if (snapshot.hasData) {
              final product = snapshot.data!;
              return Center(
                child: Padding(
                  padding: const EdgeInsets.only(right: 10),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.start,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      ProductImageSlider(
                        imagePaths: [
                          product.urlImageProductPage,
                          product.urlImageProductPage,
                          product.urlImageProductPage
                        ],
                      ),
                      const SizedBox(height: 30),
                      Padding(
                        padding: const EdgeInsets.all(10),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              product.name,
                              style: const TextStyle(
                                  fontSize: 24, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              product.description,
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 20),
                            Row(
                              crossAxisAlignment: CrossAxisAlignment
                                  .center, // Align items to the start of the column
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                if (product.price != "")
                                  Text(
                                    product.price,
                                    
                                    style: const TextStyle(
                                      color: Color.fromRGBO(215, 55, 56, 1),
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                
                                if (product.promotion != "")
                                  Text(
                                    product.promotion,
                                    
                                    style: const TextStyle(
                                      color: Color.fromRGBO(215, 55, 56, 1),
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                               
                                const SizedBox(width: 50),
                                ElevatedButton(
                                  style: ElevatedButton.styleFrom(
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    backgroundColor: voucherId.isNotEmpty
                                      ? const Color.fromRGBO(215, 55, 56, 1)
                                      : Colors.grey, // Couleur grisée si désactivé
                                  ),
                                  onPressed: voucherId.isNotEmpty
                                    ? () {
                                        String userId = getCurrentUserId();
                                        showDialog(
                                          context: context,
                                          builder: (BuildContext context) {
                                            return Voucher(
                                              productId: widget.productId,
                                              userId: userId,
                                              onRefresh: () {
                                                setState(() {
                                                  // Rafraîchir les données si nécessaire
                                                  askVoucher(userId, widget.productId);
                                                });
                                              },
                                            );
                                          },
                                        );
                                      }
                                    : null,
                                  child: const Text(
                                    "J'en profite !",
                                    style: TextStyle(color: Colors.white),
                                  ),
                                ),
                                const SizedBox(width: 50),
                              ],
                            )
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              );
            } else if (snapshot.hasError) {
              return Center(child: Text("Error: ${snapshot.error}"));
            }
          }
          // By default, show a loading spinner.
          return const Center(child: CircularProgressIndicator());
        },
      ),
    );
  }
}

class Product {
  final String id;
  final String name;
  final String description;
  final String price;
  final String promotion;
  final String urlImageProductPage;

  Product({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.promotion,
    required this.urlImageProductPage,
  });

  factory Product.fromJson(Map<String, dynamic> json) {
    return Product(
      id: json['id'] ?? '',
      name: json['data']['name'] ?? '',
      description: json['data']['description'] ?? '',
      price: json['data']['priceFinal'].toString(),
      promotion: json['data']['promotion'].toString(),
      urlImageProductPage: json['data']['urlImageProductPage'][0],
    );
  }
}
