import 'package:flutter/material.dart';

class ProductCategorySlider extends StatefulWidget {
  final List<String> categories;
  final Function(Set<String>) onCategorySelected;

  const ProductCategorySlider({
    Key? key,
    required this.categories,
    required this.onCategorySelected,
  }) : super(key: key);

  @override
  State<ProductCategorySlider> createState() => _ProductCategorySliderState();
}

class _ProductCategorySliderState extends State<ProductCategorySlider> {
  Set<String> selectedCategoryIds = Set<String>();

  @override
  void initState() {
    super.initState();
    selectedCategoryIds.addAll(widget.categories);
    WidgetsBinding.instance.addPostFrameCallback((_) {
      widget.onCategorySelected(selectedCategoryIds);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.fromLTRB(20, 0, 20, 0),
      height: 50,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        itemCount: widget.categories.length,
        itemBuilder: (context, index) {
          final category = widget.categories[index];
          final isSelected = selectedCategoryIds.contains(category);

          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4.0),
            child: ChoiceChip(
              label: Text(category),
              selected: isSelected,
              onSelected: (bool selected) {
                setState(() {
                  if (selected) {
                    selectedCategoryIds.add(category);
                  } else {
                    selectedCategoryIds.remove(category);
                  }
                  widget.onCategorySelected(selectedCategoryIds);
                });
              },
              backgroundColor: Colors.grey[200],
              selectedColor: Colors.redAccent,
              labelStyle: TextStyle(
                color: isSelected ? Colors.white : Colors.black,
              ),
            ),
          );
        },
      ),
    );
  }
}
