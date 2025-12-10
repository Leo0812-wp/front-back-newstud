import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:newstudapp/config/api_config.dart';

class Voucher extends StatefulWidget {

  final String productId;
  final String userId;
  final VoidCallback onRefresh;

  const Voucher({
    Key? key,
    required this.productId,
    required this.userId,
    required this.onRefresh,
  }) : super(key: key);

  @override
  // ignore: library_private_types_in_public_api
  _Voucher createState() => _Voucher();
}

class _Voucher extends State<Voucher> {

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }

Future<String> askVoucher(String userId, String productId) async {
    final url = Uri.parse('${ApiConfig.apiUrl}/vouchers/askVouchers');
    
    try {
      final response = await http.post(url, body: {
        'productId': productId,
        'userId': userId,
      });

      if (response.statusCode == 200) {
        final responseData = json.decode(response.body);
        print(responseData['voucherValue']);
        return responseData['voucherValue'];
      } else {
        print('Erreur : ${response.statusCode}');
        return"";
      }
    } catch (error) {
      print('Exception : $error');
      return"";
    }
  }

  Future<void> useVoucher(String userId, String voucherId) async {
    
    final url = Uri.parse('${ApiConfig.apiUrl}/vouchers/useVouchers');
    
    try {
      final response = await http.post(url, body: {
        'userId': userId,
        'voucherId': voucherId,
      });

      if (response.statusCode == 200) {
        print('Coupon utilisé avec succès');
      } else {
        print('Erreur : ${response.statusCode}');
      }
    } catch (error) {
      print('Exception : $error');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      child: Container(
        padding: const EdgeInsets.all(20),
        width: 200,
        height: 200,
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Voulez-vous utiliser le coupon ?',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 18),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () async {
                // Action à effectuer lorsque le bouton est cliqué           
                // Obtenez le voucherId en appelant askVoucher
                String voucherId = await askVoucher(widget.userId, widget.productId);
                
                if (voucherId.isNotEmpty) {
                  await useVoucher(widget.userId, voucherId);  // Utilisez le voucherId obtenu
                } else {
                  print('Échec de l\'obtention du voucherId');
                }
                widget.onRefresh(); // Appel de rafraîchissement
                Navigator.of(context).pop(); // Ferme la pop-up
              },
              child: const Text('Utiliser le coupon'),
            ),
          ],
        ),
      ),
    );
  }
}
