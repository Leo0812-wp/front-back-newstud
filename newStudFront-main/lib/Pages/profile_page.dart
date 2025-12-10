import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:newstudapp/views/auth/first_page.dart';

// ignore: use_key_in_widget_constructors
class ProfilePage extends StatelessWidget {
  final FirebaseAuth _auth = FirebaseAuth.instance;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: StreamBuilder<User?>(
        stream: _auth.authStateChanges(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.active) {
            // Check if the user is logged in
            User? user = snapshot.data;
            if (user == null) {
              // Handle the case when the user is not logged in
              return const Center(
                child: Text("Vous n'êtes pas connecté"),
              );
            }

            // User is logged in, display user information
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.center,
                children: <Widget>[
                  const SizedBox(height: 20),
                  CircleAvatar(
                    radius: 60,
                    backgroundColor: const Color.fromRGBO(215, 55, 56, 1),
                    child: Text(
                      user.displayName?.substring(0, 1) ?? '?',
                      style: const TextStyle(fontSize: 40, color: Colors.white),
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    user.displayName ?? 'Nom Prénom',
                    style: const TextStyle(
                        fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                  Text(
                    user.email ?? 'Email',
                    style: const TextStyle(color: Colors.grey),
                  ),
                  const SizedBox(height: 20),
                  _buildProfileOption(
                      // ignore: use_function_type_syntax_for_parameters
                      context,
                      "Se déconnecter",
                      Icons.exit_to_app, onTap: () {
                    _auth.signOut();
                  }),
                ],
              ),
            );
          } else {
            // Display a loading indicator while waiting for authentication data
            return const Center(child: CircularProgressIndicator());
          }
        },
      ),
    );
  }

  Widget _buildProfileOption(BuildContext context, String title, IconData icon,
      {VoidCallback? onTap}) {
    return ListTile(
      leading: Icon(icon, color: Colors.redAccent),
      title: Text(title),
      onTap: () {
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (context) => const FirstPage()),
          (Route<dynamic> route) => false,
        );
      },
    );
  }
}
