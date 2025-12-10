import 'package:flutter/material.dart';
import 'package:newstudapp/services/data_service.dart';

class Category {
  final String id;
  final String name;

  Category({required this.id, required this.name});

  factory Category.fromJson(Map<String, dynamic> json) {
    return Category(
      id: json['id'].toString(),
      name: json['data']['name'],
    );
  }
}

class CategorySlider extends StatefulWidget {
  final Function(List<String> categoryIds) onCategorySelected;

  const CategorySlider({
    Key? key,
    required this.onCategorySelected,
  }) : super(key: key);

  @override
  State<CategorySlider> createState() => _CategorySliderState();
}

class _CategorySliderState extends State<CategorySlider> {
  // Un peu comme les companies je dégoute d'initialiser comme ça,
  // dans initState récupère le résultat du fetchCategories
  // et peuple selectedCategoryIds avec
  Set<String> selectedCategoryIds = <String>{
    "SpRf9QQlgx56iVLD3I79",
    "USJc4FkhLSLVtqDpFcoz",
    "d8YtJ6RkDvfjmYc4VkqL"};
  List<Category> categories = [];

  @override
  void initState() {
    getCompanyCategories();
    super.initState();
  }

  void getCompanyCategories() async {
    final response = await DataService.getCompanyCategories();
    setState(() {
      categories = response;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.fromLTRB(20, 0, 20, 0),
      height: 50,
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Wrap(
          alignment: WrapAlignment.start,
          spacing: 5.0,
          children: categories.map<Widget>((category) {
            return ChoiceChip(
              label: Text(category.name),
              selected: selectedCategoryIds.contains(category.id),
              onSelected: (bool selected) {
                setState(() {
                  if (selected) {
                    selectedCategoryIds.add(category.id);
                  } else {
                    selectedCategoryIds.remove(category.id);
                  }
                  widget.onCategorySelected(selectedCategoryIds.toList());
                });
              },
              backgroundColor: Colors.grey[200],
              selectedColor: Colors.redAccent,
              labelStyle: TextStyle(
                color: selectedCategoryIds.contains(category.id)
                    ? Colors.white
                    : Colors.black,
              ),
            );
          }).toList(),
        ),
      ),
    );
  }
}
