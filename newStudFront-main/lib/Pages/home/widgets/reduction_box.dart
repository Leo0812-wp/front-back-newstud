import 'package:flutter/material.dart';

class ReductionBox extends StatelessWidget {
  const ReductionBox({super.key});

  _getReduction() {}

  @override
  Widget build(BuildContext context) {
    return FractionallySizedBox(
      widthFactor: 0.7,
      child: Container(
        decoration: const BoxDecoration(
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(15),
            topRight: Radius.circular(15),
            bottomLeft: Radius.circular(15),
            bottomRight: Radius.circular(15),
          ),
          color: Color.fromRGBO(215, 55, 56, 1),
        ),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            const Text(
              'Réductions exclusives',
              textAlign: TextAlign.left,
              style: TextStyle(
                  color: Color.fromRGBO(255, 255, 255, 1),
                  fontFamily: 'Roboto',
                  fontSize: 24,
                  fontWeight: FontWeight.normal,
                  height: 1),
            ),
            const SizedBox(height: 8),
            const Text(
              '6€ le coktail au Dock Yard ! ',
              textAlign: TextAlign.left,
              style: TextStyle(
                  color: Color.fromRGBO(255, 255, 255, 1),
                  fontFamily: 'Roboto',
                  fontSize: 12,
                  fontWeight: FontWeight.normal,
                  height: 1),
            ),
            const SizedBox(height: 8),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: Colors.white),
              onPressed: _getReduction,
              child: const Text(
                'J’en profite ! ',
                textAlign: TextAlign.left,
                style: TextStyle(
                    color: Color.fromRGBO(12, 12, 12, 1),
                    fontFamily: 'Roboto',
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    height: 1),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
