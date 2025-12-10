import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';

class CompanyCard extends StatefulWidget {
  final String image;
  final String category;
  final String description;
  final bool favButton;
  final VoidCallback onPressed;

  const CompanyCard(
      {Key? key,
      required this.image,
      required this.category,
      required this.description,
      required this.favButton,
      required this.onPressed})
      : super(key: key);

  @override
  State<CompanyCard> createState() => _CompanyCardState();
}

class _CompanyCardState extends State<CompanyCard> {
  // Added a variable to track whether the building is favorited or not
  bool isFav = false;

  void _toggleFavorite() {
    setState(() {
      isFav = !isFav;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        shape: BoxShape.rectangle,
        borderRadius: BorderRadius.all(Radius.circular(20)),
        boxShadow: [
          BoxShadow(
            color: Color.fromARGB(255, 217, 217, 217),
            spreadRadius: 1,
            blurRadius: 0.5,
            offset: Offset(0, 0.5),
          ),
        ],
      ),
      margin: const EdgeInsets.fromLTRB(20, 8, 20, 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Image.asset(widget.image, fit: BoxFit.cover),
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            flex: 2,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 8),
                Text(
                  widget.category,
                  style: const TextStyle(
                      fontWeight: FontWeight.bold, fontSize: 20),
                ),
                const SizedBox(height: 6),
                Text(widget.description),
                const SizedBox(height: 6),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    backgroundColor: const Color.fromRGBO(215, 55, 56, 1),
                  ),
                  onPressed: widget.onPressed,
                  child: const Text(
                    "Découvrir",
                    style: TextStyle(color: Colors.white),
                  ),
                ),
                const SizedBox(height: 6),
              ],
            ),
          ),
          Builder(
            builder: (context) {
              if (widget.favButton) {
                return IconButton(
                  onPressed: _toggleFavorite,
                  icon: Stack(
                    alignment: AlignmentDirectional.center,
                    children: [
                      SvgPicture.asset(
                        "assets/home/coeur_gris.svg",
                        color: isFav == true
                            ? const Color.fromRGBO(215, 55, 56, 1)
                            : const Color.fromRGBO(242, 242, 242, 1),
                        fit: BoxFit.contain,
                        width: 36,
                      ),
                    ],
                  ),
                );
              }
              return const SizedBox();
            },
          )
        ],
      ),
    );
  }
}
