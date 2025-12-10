import 'package:flutter/material.dart';
import 'package:newstudapp/Pages/home/company_details.dart';
import 'package:newstudapp/TopBar/search_service.dart';

class SearchButton extends StatefulWidget {
  const SearchButton({Key? key}) : super(key: key);

  @override
  State<SearchButton> createState() => _SearchButtonState();
}

class _SearchButtonState extends State<SearchButton> {
  String? _searchingWithQuery;

  List<Map<String, dynamic>> buildings = [];

  // The most recent options received from the API.
  late Iterable<Widget> _lastOptions = <Widget>[];

  @override
  Widget build(BuildContext context) {
    //Search Button
    return SearchAnchor(
      builder: (BuildContext context, SearchController controller) {
        return IconButton(
          onPressed: controller.openView,
          icon: Image.asset(
            'assets/TopBar/searchIcon.png',
          ),
        );
      },
      suggestionsBuilder:
          (BuildContext context, SearchController controller) async {
        _searchingWithQuery = controller.text;

        if (_searchingWithQuery!.isEmpty) {
          return _lastOptions;
        }

        final List<Map<String, dynamic>> companies =
            await SearchService.searchByName(_searchingWithQuery!);

        if (_searchingWithQuery != controller.text) {
          return _lastOptions;
        }

        _lastOptions = companies.map((company) {
          return ListTile(
            title: Text(company['data']['name']),
            subtitle: Text(company['data']['description']),
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (context) => CompanyDetailsPage(building: company),
                ),
              );
            },
          );
        }).toList();

        return _lastOptions;
      },
    );
  }
}
