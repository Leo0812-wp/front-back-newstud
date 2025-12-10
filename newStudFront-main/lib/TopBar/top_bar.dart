import 'package:flutter/material.dart';
import 'search.dart';

class TopBar extends StatelessWidget implements PreferredSizeWidget {
  const TopBar({super.key});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      primary: false,
      elevation: 0,
      backgroundColor: Colors.white10,
      actions: const <Widget>[],
    );
  }

  @override
  final Size preferredSize = const Size.fromHeight(kToolbarHeight);
}
