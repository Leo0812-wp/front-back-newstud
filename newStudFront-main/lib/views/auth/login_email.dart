import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:newstudapp/navigation/navigation_controller.dart';
import 'signup_email.dart';
import 'first_page.dart';

class LoginEmailScreen extends StatelessWidget {
  LoginEmailScreen({super.key});

  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

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
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => const FirstPage(),
                      ),
                    );
                  },
                  child: SvgPicture.asset(
                    'assets/img/logo.svg',
                    height: 200,
                    width: 250,
                  ),
                ),
                const Text(
                  'Connecte toi',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 20),
                _buildInputWithLabel('Email', 'F0F0F0',
                    controller: emailController),
                const SizedBox(height: 20),
                _buildInputWithLabel('Mot de passe', 'F0F0F0',
                    isPassword: true, controller: passwordController),
                const SizedBox(height: 20),
                _buildCustomButton('Se connecter', context),
                const SizedBox(height: 20),
                GestureDetector(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => SignupEmailScreen(),
                      ),
                    );
                  },
                  child: const Text(
                    'Pas encore inscrit ? Inscris-toi !',
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
          try {
            UserCredential userCredential =
                await FirebaseAuth.instance.signInWithEmailAndPassword(
              email: emailController.text,
              password: passwordController.text,
            );

            print('Connecté avec succès: ${userCredential.user!.uid}');

            // Ajoutez ici la logique de redirection vers la page après la connexion réussie
            Navigator.pushAndRemoveUntil(
              context,
              MaterialPageRoute(
                builder: (context) => const NavigationController(),
              ),
              (Route<dynamic> route) => false,
            );
          } catch (e) {
            print('Erreur lors de la connexion: $e');

            // Affichez un message d'erreur en cas d'échec de connexion
            showDialog(
              context: context,
              builder: (context) => AlertDialog(
                title: const Text('Erreur de connexion'),
                content:
                    const Text('L\'email ou le mot de passe est incorrect.'),
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
            const Icon(Icons.login),
            const SizedBox(width: 10),
            Text(text),
          ],
        ),
      ),
    );
  }
}
