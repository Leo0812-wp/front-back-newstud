import 'package:flutter/material.dart';
import 'package:newstudapp/Pages/home/home_page.dart';
import 'package:newstudapp/Pages/favorites_page.dart';
import 'package:newstudapp/Pages/profile_page.dart';
import 'package:newstudapp/TopBar/top_bar.dart';
import 'package:firebase_auth/firebase_auth.dart';

class NavigationService extends StatelessWidget {
  const NavigationService({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: BottomNavbar(),
    );
  }
}

class BottomNavbar extends StatefulWidget {
  const BottomNavbar({super.key});

  @override
  State<BottomNavbar> createState() => _BottomNavbarState();
}

class _BottomNavbarState extends State<BottomNavbar> {
  int _selectedIndex = 0;
  List<Widget> _widgetOptions = []; // Initialize with an empty list

  @override
  void initState() {
    super.initState();
    _initWidgetOptions();
  }

  void _initWidgetOptions() async {
    User? user = FirebaseAuth.instance.currentUser;
    String userId = user?.uid ??
        'default_user_id'; // Ensure handling when user is not logged in

    List<Widget> widgets = [
      const HomePage(),
      FavoritePage(userId: userId), // Pass user ID to FavoritesPage
      ProfilePage(),
    ];

    setState(() {
      _widgetOptions = widgets;
    });
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    // Check if the widget options are still empty
    if (_widgetOptions.isEmpty) {
      return const Scaffold(
        body: Center(
            child:
                CircularProgressIndicator()), // Show loading indicator while fetching user data
      );
    }

    return Scaffold(
      appBar: const TopBar(),
      body: IndexedStack(
        index: _selectedIndex,
        children: _widgetOptions,
      ),
      bottomNavigationBar: BottomNavigationBar(
        showUnselectedLabels: true,
        unselectedItemColor: Colors.grey,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.favorite),
            label: 'Favorites',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.account_box),
            label: 'Profile',
          ),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: const Color.fromRGBO(215, 55, 56, 1),
        onTap: _onItemTapped,
      ),
    );
  }
}
