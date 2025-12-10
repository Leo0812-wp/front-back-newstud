import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:newstudapp/config/api_config.dart';

class BuildingCard extends StatelessWidget {
  final String id;
  final String image;
  final String category;
  final String description;
  final VoidCallback onPressed;

  BuildingCard({
    Key? key,
    required this.id,
    required this.image,
    required this.category,
    required this.description,
    required this.onPressed,
  }) : super(key: key);

  final FirebaseAuth _auth = FirebaseAuth.instance;

  void showSnackbar(BuildContext context, String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  Future<void> _favorite(BuildContext context) async {
    User? user = _auth.currentUser;
    if (user != null) {
      String userId = user.uid;
      var url = Uri.parse(
          '${ApiConfig.apiUrl}/company/addToFavorite');
      var response = await http.post(
        url,
        body: jsonEncode({
          'companyId': id,
          'userId': userId
        }), // Replace "id" with actual company ID as needed
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
            content: Text("L'établissement a été ajouté ou retiré des favoris")));
      } else {
        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
            content:
                Text("L'établissement n'a pas pu être ajouté au favoris")));
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Vous n'étes pas connecté")));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 4,
      margin: const EdgeInsets.fromLTRB(20, 8, 20, 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(10),
              child: Image.network(image, fit: BoxFit.cover),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            flex: 2,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 8),
                Text(
                  category,
                  style: const TextStyle(
                      fontWeight: FontWeight.bold, fontSize: 20),
                ),
                const SizedBox(height: 6),
                Text(description),
                const SizedBox(height: 6),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    backgroundColor: const Color.fromRGBO(215, 55, 56, 1),
                  ),
                  onPressed: onPressed,
                  child: const Text(
                    "Découvrir",
                    style: TextStyle(color: Colors.white),
                  ),
                ),
                const SizedBox(height: 6),
              ],
            ),
          ),
          IconButton(
            onPressed: () => _favorite(context),
            icon: Stack(
              alignment: AlignmentDirectional.center,
              children: [
                SvgPicture.asset(
                  "assets/home/coeur_gris.svg",
                  color: const Color.fromRGBO(215, 55, 56, 1),
                  fit: BoxFit.contain,
                  width: 25,
                ),
                SvgPicture.asset(
                  "assets/home/coeur_gris.svg",
                  color: Colors.white,
                  fit: BoxFit.contain,
                  width: 18,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

@override
Widget build(BuildContext context) {
  throw UnimplementedError();
}
