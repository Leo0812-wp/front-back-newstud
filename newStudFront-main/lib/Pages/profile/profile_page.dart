import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  _changeProfilePicture() {}
  _myInformations() {}
  _logout() {}
  _myCoupons() {}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          children: [
            ClipOval(
              child: Material(
                color: Colors.transparent,
                child: IconButton(
                  onPressed: _changeProfilePicture(),
                  icon: Stack(
                    alignment: AlignmentDirectional.center,
                    children: [
                      SvgPicture.asset(
                        "assets/home/elephant_rouge.svg", // A changer avec un appel api
                        color: const Color.fromRGBO(215, 55, 56, 1),
                        width: 150,
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const Text("Liza Horllow"),
            const Text("lizahorllow@gmail.com"),
            const SizedBox(height: 40),
            IconButton(
              icon: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.settings),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 8.0),
                    child:
                        SizedBox(width: 120, child: Text("Mes informations")),
                  ),
                ],
              ),
              onPressed: _myInformations(),
            ),
            IconButton(
              icon: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.receipt),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 8.0),
                    child: SizedBox(width: 120, child: Text("Mes coupons")),
                  ),
                ],
              ),
              onPressed: _myCoupons(),
            ),
            IconButton(
              icon: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.logout),
                  Padding(
                    padding: EdgeInsets.symmetric(horizontal: 8.0),
                    child: SizedBox(
                      width: 120,
                      child: Text("Se déconnecter"),
                    ),
                  ),
                ],
              ),
              onPressed: _logout(),
            ),
          ],
        ),
      ),
    );
  }
}
