import 'package:flutter/material.dart';
import 'package:newstudapp/views/auth/first_page.dart';
import 'package:firebase_core/firebase_core.dart';

import 'firebase_options.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );
    runApp(const MyApp());
  } catch (e) {
    debugPrint('Firebase initialization error: $e');
  }
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(top: 40.0),
      child: MaterialApp(
        title: 'NewStud',
        theme: ThemeData(
          primaryColor: const Color(0xffD73738),
          fontFamily: 'Roboto',
        ),
        home: const FirstPage(), // Set FirstPage as the initial page
      ),
    );
  }
}
