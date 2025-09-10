import 'package:flutter/material.dart';
import 'screens/home_screen.dart';
import 'screens/register_screen.dart';

import 'package:mappls_gl/mappls_gl.dart';

void main() {

  MapplsAccountManager.setMapSDKKey("5377bde8d8c3ddf9911d92fa1a0de20c");
  MapplsAccountManager.setRestAPIKey("5377bde8d8c3ddf9911d92fa1a0de20c");
  MapplsAccountManager.setAtlasClientId("96dHZVzsAuuBT8x4hZDvVp0gzekV196XpY0DJ5oaRgkWNjvBUzTrm7zak_usw7B-TwL-hjpGAh6v5H8UkJ8Yc7CsHmed3Fxm");
  MapplsAccountManager.setAtlasClientSecret("lrFxI-iSEg_H5xoJoCSTpqr7FBkWzwSrAObFm7RBmpLSmTHp470hx8hw_cMfZds39icFodjNeW4c3h8D0W4enmcWq8EhL1pSWB_5VGmYLjg=");

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Proto',
      theme: ThemeData(

        fontFamily: "Inter",
        primarySwatch: Colors.indigo,
        useMaterial3: true,
      ),
      // Start with AuthPage, after login navigate to MapScreen
      home: const AuthPage(),
    );
  }
}
