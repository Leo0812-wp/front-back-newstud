import 'package:flutter/material.dart';
import 'package:newstudapp/navigation/navigation_service.dart';

class NavigationController extends StatelessWidget {
  const NavigationController({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      bottomNavigationBar: NavigationService(),
    );
  }
}
