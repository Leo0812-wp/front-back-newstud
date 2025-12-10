import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'first_page.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:newstudapp/navigation/navigation_controller.dart';
import 'package:http/http.dart' as http;
import 'package:newstudapp/config/api_config.dart';


class SignupEmailScreen extends StatelessWidget {
  SignupEmailScreen({super.key});

  final TextEditingController emailController = TextEditingController();
  final TextEditingController nameController = TextEditingController();
  final TextEditingController firstNameController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController =
      TextEditingController();

  
Future<void> createUser (String userId, String name, String firstName) async {
    final url = Uri.parse('${ApiConfig.apiUrl}/user/create');
    
    try {
      final response = await http.post(url, body: {
        'uid': userId,
        'name': name,
        'firstName': firstName
      });

      if (response.statusCode == 200) {
        print("user created");
      } else {
        print('Erreur : ${response.statusCode}');
      }
    } catch (error) {
      print('Exception : $error');
    }
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                GestureDetector(
                  onTap: () {
                    // Ajoutez ici la logique pour rediriger vers la page home
                    Navigator.pushAndRemoveUntil(
                      context,
                      MaterialPageRoute(
                          builder: (context) => const NavigationController(),
                      ),
                      (Route<dynamic> route) => false,
                    );
                  },
                  child: SvgPicture.asset(
                    'assets/img/logo.svg', // Remplacez par le chemin de votre logo SVG
                    height: 200,
                    width: 250,
                  ),
                ),
                const Text(
                  'Créer ton compte', // Ajout du titre ici
                  style: TextStyle(
                    fontSize:
                        24, // Vous pouvez ajuster la taille de la police selon vos préférences
                    fontWeight: FontWeight.bold,
                  ),
                ),
                //mail
                _buildInputWithLabel('Email', 'F0F0F0',
                    controller: emailController),
                //Name and firstName
                const SizedBox(height: 20),
                Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly, // Ajuste l'alignement horizontal
                children: [
                  Expanded(
                    child: _buildInputWithLabel('Nom', 'F0F0F0', controller: nameController),
                  ),
                  const SizedBox(width: 10), // Ajoute un espacement entre les champs
                  Expanded(
                    child: _buildInputWithLabel('Prénom', 'F0F0F0', controller: firstNameController),
                  ),
                ]),
                //password
                const SizedBox(height: 20),
                _buildInputWithLabel('Mot de passe', 'F0F0F0',
                    isPassword: true, controller: passwordController),
                const SizedBox(height: 20),
                // confirmation password
                _buildInputWithLabel('Confirmation de mot de passe', 'F0F0F0',
                    isPassword: true, controller: confirmPasswordController),
                const SizedBox(height: 20),
                _buildCustomButton("S'inscrire", context),
                const SizedBox(height: 20),
                GestureDetector(
                  onTap: () {
                    // Ajoutez ici la logique pour rediriger vers la page de connexion
                    Navigator.pop(context);
                  },
                  child: const Text(
                    'Déjà inscrit ? Connecte-toi !',
                    style: TextStyle(
                      color: Colors.red,
                      decoration: TextDecoration.underline,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildInputWithLabel(String label, String bgColor,
    {bool isPassword = false, TextEditingController? controller}) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(color: Colors.black),
        ),
        const SizedBox(height: 8),
        SizedBox(
          height: 40, // Définit une hauteur plus petite pour le champ de saisie
          child: TextField(
            obscureText: isPassword,
            controller: controller,
            decoration: InputDecoration(
              filled: true,
              fillColor: Color(int.parse('0xFF$bgColor')),
              border: OutlineInputBorder(
                borderSide: BorderSide.none,
                borderRadius: BorderRadius.circular(8), // Coins arrondis
              ),
              contentPadding: const EdgeInsets.symmetric(vertical: 10, horizontal: 12), // Réduit l'espace interne
            ),
            style: const TextStyle(fontSize: 14), // Réduit la taille du texte
          ),
        ),
      ],
    );
  }


  Widget _buildCustomButton(String text, BuildContext context) {
    return SizedBox(
      width: 300,
      child: ElevatedButton(
        onPressed: () async {
          // Vérification que le mot de passe et la confirmation de mot de passe sont les mêmes
          if (passwordController.text == confirmPasswordController.text) {
            try {
              // Création du compte Firebase
              UserCredential userCredential =
                  await FirebaseAuth.instance.createUserWithEmailAndPassword(
                email: emailController
                    .text, // Assurez-vous d'avoir un contrôleur pour l'email
                password: passwordController.text,
              );

              createUser(userCredential.user!.uid, nameController.text, firstNameController.text);

              // Affichez un message ou effectuez d'autres actions en cas de succès
              print('Compte créé avec succès: ${userCredential.user!.uid}');

              Navigator.pushAndRemoveUntil(
                context,
                MaterialPageRoute(
                  builder: (context) => const NavigationController(),
                ),
                (Route<dynamic> route) => false,
              );
            } catch (e) {
              // Affichez une erreur en cas d'échec
              print('Erreur lors de la création du compte: $e');
            }
          } else {
            // Affichage d'un message d'erreur si les mots de passe ne correspondent pas
            showDialog(
              context: context, // Utilisez le contexte passé en paramètre
              builder: (context) => AlertDialog(
                title: const Text('Erreur'),
                content:
                    const Text('Les mots de passe doivent être identique.'),
                actions: [
                  TextButton(
                    onPressed: () {
                      Navigator.pop(context);
                    },
                    child: const Text('OK'),
                  ),
                ],
              ),
            );
          }
        },
        style: ElevatedButton.styleFrom(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(vertical: 13, horizontal: 50),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Icon(Icons.person_add),
            const SizedBox(width: 10),
            Text(text),
          ],
        ),
      ),
    );
  }
}
