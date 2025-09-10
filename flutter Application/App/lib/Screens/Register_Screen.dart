  import 'package:flutter/material.dart';
  import 'dart:convert';
  import 'home_screen.dart';

  class AuthPage extends StatefulWidget {
    const AuthPage({super.key});

    @override
    State<AuthPage> createState() => _AuthPageState();
  }

  class _AuthPageState extends State<AuthPage> {
    final TextEditingController _usernameController = TextEditingController();
    final TextEditingController _passwordController = TextEditingController();

    // Register fields
    final TextEditingController _nameController = TextEditingController();
    final TextEditingController _emailController = TextEditingController();
    final TextEditingController _phoneController = TextEditingController();
    final TextEditingController _ageController = TextEditingController();
    final TextEditingController _confirmPasswordController =
    TextEditingController();

    String? _selectedGender;
    bool _obscurePassword = true;
    bool _keepSignedIn = false;
    bool _isLogin = true;

    // Family members list
    List<Map<String, dynamic>> _familyMembers = [];

    @override
    Widget build(BuildContext context) {
      return LayoutBuilder(
        builder: (context, constraints) {
          final screenWidth = constraints.maxWidth;
          final screenHeight = constraints.maxHeight;
          final isTablet = screenWidth > 600;

          final double titleFontSize = isTablet ? 48 : 36;
          final double inputFontSize = isTablet ? 18 : 16;
          final double buttonHeight = isTablet ? 60 : 50;
          final double avatarRadius = isTablet ? 80 : 60;
          final double paddingHorizontal = isTablet ? 32 : 24;

          return Scaffold(
            body: Container(
              width: screenWidth,
              height: screenHeight,
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF6A5ACD), Color(0xFF483D8B)],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
              ),
              child: Column(
                children: [
                  SizedBox(height: isTablet ? 60 : 40),

                  // Gradient Title
                  ShaderMask(
                    shaderCallback: (bounds) => const LinearGradient(
                      colors: [Color(0xFFFF9933), Colors.white, Color(0xFF138808)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ).createShader(bounds),
                    child: Text(
                      "Ishtdev",
                      style: TextStyle(
                        fontSize: titleFontSize,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        letterSpacing: 1.5,
                      ),
                    ),
                  ),

                  const SizedBox(height: 10),

                  // Stack: Avatar + Card
                  Expanded(
                    child: Stack(
                      alignment: Alignment.topCenter,
                      clipBehavior: Clip.none,
                      children: [
                        // White Card
                        Container(
                          margin: EdgeInsets.only(top: avatarRadius + 8),
                          width: screenWidth,
                          height: double.infinity,
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: const BorderRadius.only(
                              topLeft: Radius.circular(30),
                              topRight: Radius.circular(30),
                            ),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black12,
                                blurRadius: 10,
                                offset: Offset(0, -4),
                              ),
                            ],
                          ),
                          padding: EdgeInsets.symmetric(
                            horizontal: paddingHorizontal,
                            vertical: isTablet ? 100 : 80,
                          ),
                          child: SingleChildScrollView(
                            child: Column(
                              children: [
                                Text(
                                  _isLogin ? "Welcome Back" : "Create Account",
                                  style: TextStyle(
                                    fontSize: inputFontSize + 4,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.black,
                                  ),
                                ),
                                const SizedBox(height: 5),
                                Text(
                                  _isLogin
                                      ? "Please sign in with your credentials"
                                      : "Fill in the details to register",
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    color: Colors.black54,
                                    fontSize: inputFontSize,
                                  ),
                                ),
                                const SizedBox(height: 30),

                                // REGISTER FIELDS
                                if (!_isLogin) ...[
                                  _buildTextField(_nameController, "Full Name",
                                      Icons.person,
                                      inputFontSize: inputFontSize),
                                  const SizedBox(height: 20),
                                  _buildTextField(_emailController, "Email",
                                      Icons.email,
                                      inputFontSize: inputFontSize),
                                  const SizedBox(height: 20),
                                  _buildTextField(_phoneController,
                                      "Phone Number", Icons.phone,
                                      inputFontSize: inputFontSize,
                                      keyboardType: TextInputType.phone),
                                  const SizedBox(height: 20),
                                  _buildTextField(
                                      _ageController, "Age", Icons.calendar_today,
                                      inputFontSize: inputFontSize,
                                      keyboardType: TextInputType.number),
                                  const SizedBox(height: 20),
                                  DropdownButtonFormField<String>(
                                    value: _selectedGender,
                                    items: ["Male", "Female", "Other"]
                                        .map((g) => DropdownMenuItem(
                                      value: g,
                                      child: Text(g),
                                    ))
                                        .toList(),
                                    onChanged: (value) {
                                      setState(() {
                                        _selectedGender = value;
                                      });
                                    },
                                    decoration: _inputDecoration(
                                        "Gender", Icons.wc, inputFontSize),
                                  ),
                                  const SizedBox(height: 20),

                                  // Family Members Section
                                  Align(
                                    alignment: Alignment.centerLeft,
                                    child: Text(
                                      "Family Members",
                                      style: TextStyle(
                                        fontSize: inputFontSize + 2,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.black87,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 10),

                                  ..._familyMembers.asMap().entries.map((entry) {
                                    int index = entry.key;
                                    var member = entry.value;
                                    return Card(
                                      margin: const EdgeInsets.only(bottom: 12),
                                      child: ListTile(
                                        title: Text(
                                            "${member['name']} (${member['age']} yrs)"),
                                        subtitle: Text(member['gender']),
                                        trailing: IconButton(
                                          icon: const Icon(Icons.delete,
                                              color: Colors.red),
                                          onPressed: () {
                                            setState(() {
                                              _familyMembers.removeAt(index);
                                            });
                                          },
                                        ),
                                      ),
                                    );
                                  }),

                                  ElevatedButton.icon(
                                    onPressed: () => _showAddFamilyDialog(
                                        context, inputFontSize),
                                    icon: const Icon(Icons.group_add),
                                    label: const Text("Add Family Member"),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.deepPurple,
                                      foregroundColor: Colors.white,
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(12),
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 20),
                                ],

                                // LOGIN FIELD: Username
                                if (_isLogin) ...[
                                  _buildTextField(_usernameController, "Username",
                                      Icons.person_outline,
                                      inputFontSize: inputFontSize),
                                  const SizedBox(height: 20),
                                ],

                                // Password (common)
                                _buildTextField(_passwordController, "Password",
                                    Icons.lock_outline,
                                    inputFontSize: inputFontSize,
                                    obscure: _obscurePassword,
                                    suffix: IconButton(
                                      icon: Icon(
                                        _obscurePassword
                                            ? Icons.visibility_off
                                            : Icons.visibility,
                                      ),
                                      onPressed: () {
                                        setState(() {
                                          _obscurePassword = !_obscurePassword;
                                        });
                                      },
                                    )),
                                const SizedBox(height: 20),

                                // Confirm Password (only Register)
                                if (!_isLogin) ...[
                                  _buildTextField(_confirmPasswordController,
                                      "Confirm Password", Icons.lock,
                                      inputFontSize: inputFontSize,
                                      obscure: true),
                                  const SizedBox(height: 20),
                                ],

                                // Login only: Keep signed in + Forgot
                                if (_isLogin) ...[
                                  Row(
                                    children: [
                                      Checkbox(
                                        value: _keepSignedIn,
                                        onChanged: (value) {
                                          setState(() {
                                            _keepSignedIn = value ?? false;
                                          });
                                        },
                                      ),
                                      const Text("Keep me signed in"),
                                      const Spacer(),
                                      TextButton(
                                        onPressed: () {},
                                        child: const Text(
                                          "Forgot Password?",
                                          style: TextStyle(
                                              color: Colors.deepPurple),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 20),
                                ],

                                // Submit Button (Gradient)
                                SizedBox(
                                  width: double.infinity,
                                  height: buttonHeight,
                                  child: DecoratedBox(
                                    decoration: BoxDecoration(
                                      gradient: const LinearGradient(
                                        colors: [
                                          Color(0xFF6A5ACD),
                                          Color(0xFF8A2BE2)
                                        ],
                                      ),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: ElevatedButton(
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: Colors.transparent,
                                        shadowColor: Colors.transparent,
                                        shape: RoundedRectangleBorder(
                                          borderRadius: BorderRadius.circular(12),
                                        ),
                                      ),
                                      onPressed: () {
                                        if (_isLogin) {
                                          Navigator.pushReplacement(
                                            context,
                                            MaterialPageRoute(
                                              builder: (context) =>
                                              const HomeScreen(),
                                            ),
                                          );
                                        } else {
                                          // Collect registration data including family
                                          final data = {
                                            "name": _nameController.text,
                                            "email": _emailController.text,
                                            "phone": _phoneController.text,
                                            "age": _ageController.text,
                                            "gender": _selectedGender,
                                            "family": _familyMembers,
                                          };
                                          String qrData = jsonEncode(data);

                                          debugPrint("Registration Data: $qrData");

                                          ScaffoldMessenger.of(context)
                                              .showSnackBar(
                                            const SnackBar(
                                              content: Text(
                                                  "Registered Successfully (demo)"),
                                            ),
                                          );
                                          setState(() {
                                            _isLogin = true;
                                          });
                                        }
                                      },
                                      child: Text(
                                        _isLogin ? "Sign In" : "Register",
                                        style: TextStyle(
                                          fontSize: inputFontSize + 2,
                                          color: Colors.white,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 20),

                                // Toggle between Login/Register
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      _isLogin
                                          ? "Don't have an account?"
                                          : "Already have an account?",
                                      style: const TextStyle(
                                        color: Colors.black54,
                                      ),
                                    ),
                                    TextButton(
                                      onPressed: () {
                                        setState(() {
                                          _isLogin = !_isLogin;
                                        });
                                      },
                                      child: Text(
                                        _isLogin ? "Register" : "Login",
                                        style: const TextStyle(
                                          color: Colors.deepPurple,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ),

                        // Avatar
                        Positioned(
                          top: 0,
                          child: CircleAvatar(
                            radius: avatarRadius + 6,
                            backgroundColor: Colors.white,
                            child: CircleAvatar(
                              radius: avatarRadius,
                              backgroundImage:
                              const AssetImage("assets/images/logo.png"),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      );
    }

    Widget _buildTextField(TextEditingController controller, String label,
        IconData icon,
        {double inputFontSize = 16,
          bool obscure = false,
          TextInputType keyboardType = TextInputType.text,
          Widget? suffix}) {
      return TextField(
        controller: controller,
        obscureText: obscure,
        keyboardType: keyboardType,
        style: TextStyle(fontSize: inputFontSize),
        decoration: _inputDecoration(label, icon, inputFontSize, suffix: suffix),
      );
    }

    InputDecoration _inputDecoration(String label, IconData icon,
        double inputFontSize,
        {Widget? suffix}) {
      return InputDecoration(
        prefixIcon: Icon(icon),
        labelText: label,
        labelStyle: TextStyle(fontSize: inputFontSize),
        filled: true,
        fillColor: Colors.grey[200],
        suffixIcon: suffix,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
      );
    }

    void _showAddFamilyDialog(BuildContext context, double fontSize) {
      final nameController = TextEditingController();
      final ageController = TextEditingController();
      String? gender;

      showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          title: const Text("Add Family Member"),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameController,
                decoration: const InputDecoration(labelText: "Name"),
              ),
              TextField(
                controller: ageController,
                decoration: const InputDecoration(labelText: "Age"),
                keyboardType: TextInputType.number,
              ),
              DropdownButtonFormField<String>(
                value: gender,
                items: ["Male", "Female", "Other"]
                    .map((g) =>
                    DropdownMenuItem(value: g, child: Text(g)))
                    .toList(),
                onChanged: (value) {
                  gender = value;
                },
                decoration: const InputDecoration(labelText: "Gender"),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text("Cancel"),
            ),
            ElevatedButton(
              onPressed: () {
                if (nameController.text.isNotEmpty &&
                    ageController.text.isNotEmpty &&
                    gender != null) {
                  setState(() {
                    _familyMembers.add({
                      "name": nameController.text,
                      "age": ageController.text,
                      "gender": gender,
                    });
                  });
                  Navigator.pop(ctx);
                }
              },
              child: const Text("Add"),
            ),
          ],
        ),
      );
    }
  }
