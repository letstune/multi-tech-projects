import 'package:app/Screens/timing_tracker.dart';
import 'package:flutter/material.dart';

import 'map_screen.dart';
import 'crowd_screen.dart';
import 'lost_found_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
   MapScreen(),
    CrowdMapScreen(),
    ZoneTrackerScreen(),
    LostFoundScreen(),
  ];

  final List<String> _titles = [
    " Digital Map",
    " Crowd Control",
    "Devotee Timing Tracker",
    "Lost & Found",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // AMAZING APPBAR
      appBar: AppBar(
        elevation: 0,
        centerTitle: true,
        backgroundColor: Colors.transparent,
        flexibleSpace: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Colors.deepPurple, Colors.blueAccent],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
        ),
        title: Text(
          _titles[_currentIndex],
          style: const TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
            letterSpacing: 1.2,
          ),
        ),
      ),

      // BODY SCREENS
      body: AnimatedSwitcher(
        duration: const Duration(milliseconds: 400),
        transitionBuilder: (child, anim) => FadeTransition(
          opacity: anim,
          child: SlideTransition(
            position: Tween<Offset>(
              begin: const Offset(0.1, 0.1),
              end: Offset.zero,
            ).animate(anim),
            child: child,
          ),
        ),
        child: _screens[_currentIndex],
      ),

      // CURVED BOTTOM NAVIGATION
      bottomNavigationBar: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.deepPurple, Colors.blueAccent],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(0),
            topRight: Radius.circular(0),
          ),
        ),
        child: ClipRRect(
          borderRadius: const BorderRadius.only(
            topLeft: Radius.circular(24),
            topRight: Radius.circular(24),
          ),
          child: BottomNavigationBar(
            backgroundColor: Colors.transparent,
            currentIndex: _currentIndex,
            type: BottomNavigationBarType.fixed,
            selectedItemColor: Colors.white,
            unselectedItemColor: Colors.white70,
            selectedFontSize: 14,
            unselectedFontSize: 12,
            elevation: 0,
            onTap: (index) {
              setState(() => _currentIndex = index);
            },
            items: const [
              BottomNavigationBarItem(
                icon: Icon(Icons.map),
                label: "Map",
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.people),
                label: "Crowd",
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.access_time),
                label: "Timing",
              ),
              BottomNavigationBarItem(
                icon: Icon(Icons.search),
                label: "Lost",
              ),
            ],
          ),
        ),
      ),

      // FAB


    );
  }
}
