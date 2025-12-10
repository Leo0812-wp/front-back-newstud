import 'package:flutter/material.dart';

class ProductImageSlider extends StatefulWidget {
  final List<String> imagePaths;

  const ProductImageSlider({Key? key, required this.imagePaths})
      : super(key: key);

  @override
  // ignore: library_private_types_in_public_api
  _ProductImageSliderState createState() => _ProductImageSliderState();
}

class _ProductImageSliderState extends State<ProductImageSlider> {
  int _selectedImageIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.zero, // Set padding to zero
      child: Row(
        children: [
          Expanded(
            child: Column(
              children: List.generate(widget.imagePaths.length, (index) {
                return GestureDetector(
                  onTap: () {
                    setState(() {
                      _selectedImageIndex = index;
                    });
                  },
                  child: Padding(
                    padding: EdgeInsets.only(
                      top: index == 0
                          ? 0
                          : 8.0, // No top padding for the first item
                      bottom: index == widget.imagePaths.length - 1
                          ? 0
                          : 8.0, // No bottom padding for the last item
                    ),
                    child: Container(
                      decoration: _selectedImageIndex == index
                          ? BoxDecoration(
                              border: Border.all(color: Colors.red),
                            )
                          : null,
                      child: Image.network(
                        widget.imagePaths[index],
                        height: 100,
                        width: 100,
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                );
              }),
            ),
          ),
          // Column for the full-sized image
          Expanded(
            flex: 2,
            child: Image.network(
              widget.imagePaths[_selectedImageIndex],
              fit: BoxFit.cover,
              height: 335,
            ),
          ),
        ],
      ),
    );
  }
}
