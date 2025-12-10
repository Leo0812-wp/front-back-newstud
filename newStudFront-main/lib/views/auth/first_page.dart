import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:newstudapp/views/auth/signup_email.dart';

import 'login_email.dart';

class FirstPage extends StatelessWidget {
  const FirstPage({Key? key}) : super(key: key);

  Widget buildButton({
    required Color buttonColor,
    required Color textColor,
    required String buttonText,
    required VoidCallback onPressed,
    required Widget icon,
    double fontSize = 16,
  }) {
    return SizedBox(
      width: 300, // Set a fixed width for all buttons
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          foregroundColor: textColor,
          backgroundColor: buttonColor,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          padding: const EdgeInsets.symmetric(vertical: 13, horizontal: 50),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            icon,
            const SizedBox(width: 10),
            Text(
              buttonText,
              style: TextStyle(fontSize: fontSize, color: textColor),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    // ignore: prefer_typing_uninitialized_variables
    var response;

    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SvgPicture.asset(
                'assets/img/logo.svg',
                height: 200,
                width: 250,
              ),
              const SizedBox(height: (100)),
              buildButton(
                buttonColor: const Color(0xffD73738),
                textColor: const Color(0xffffffff),
                buttonText: 'Se connecter',
                fontSize: 18,
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => LoginEmailScreen()),
                  );
                },
                icon: const Icon(
                  Icons.login,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 10),
              buildButton(
                buttonColor: const Color(0xffD73738),
                textColor: const Color(0xffffffff),
                buttonText: "S'inscrire",
                fontSize: 18,
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => SignupEmailScreen()),
                  );
                },
                icon: const Icon(
                  Icons.person_add,
                  color: Colors.white,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
