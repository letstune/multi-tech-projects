import 'package:flutter/material.dart';import 'dart:io';
import 'package:image_picker/image_picker.dart';


class LostFoundScreen extends StatefulWidget {
  const LostFoundScreen({super.key});

  @override
  State<LostFoundScreen> createState() => _LostFoundScreenState();
}

class _LostFoundScreenState extends State<LostFoundScreen> {
  final List<Map<String, dynamic>> _items = [
    {
      "title": "Black Wallet",
      "desc": "Lost near Gate No. 2",
      "status": "Lost",
      "contact": "9876543210",
      "type": "Item"
    },
    {


    "title": "Gold Bracelet",
      "desc": "Found at Main Ghat",
      "status": "Found",
      "contact": "9991112222",
      "type": "Item"
    },
  ];

  String _filter = "All";

  // Controllers for dialog
  final TextEditingController _contactController = TextEditingController();
  final TextEditingController _descController = TextEditingController();
  final TextEditingController _nameController = TextEditingController();

  String _selectedType = "Item";
  String _selectedStatus = "Lost";

  @override
  Widget build(BuildContext context) {
    final filteredItems =
    _filter == "All" ? _items : _items.where((i) => i["status"] == _filter).toList();

    return Scaffold(
      backgroundColor: const Color(0xFF0D0D10),
      body: SafeArea(
        child: Column(
          children: [
            // Top Row (Report Button + Filter)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  // Report Button
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.transparent,
                      shadowColor: Colors.transparent,
                      padding: EdgeInsets.zero,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14),
                      ),
                    ),
                    onPressed: _openReportDialog, // ✅ Fixed here
                    child: Ink(
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF00FFC6), Color(0xFF0091FF)],
                        ),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                        child: const Text(
                          "Report Lost / Found",
                          style: TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.bold,
                            color: Colors.black,
                          ),
                        ),
                      ),
                    ),
                  ),

                  // Filter Dropdown
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    decoration: BoxDecoration(
                      color: Colors.white10,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: DropdownButton<String>(
                      value: _filter,
                      underline: Container(),
                      dropdownColor: Colors.black87,
                      icon: const Icon(Icons.filter_list, color: Colors.white70),
                      style: const TextStyle(color: Colors.white),
                      items: const [
                        DropdownMenuItem(value: "All", child: Text("All")),
                        DropdownMenuItem(value: "Lost", child: Text("Lost")),
                        DropdownMenuItem(value: "Found", child: Text("Found")),
                      ],
                      onChanged: (val) => setState(() => _filter = val!),
                    ),
                  ),
                ],
              ),
            ),

            // List
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.all(16),
                itemCount: filteredItems.length,
                itemBuilder: (context, index) {
                  final item = filteredItems[index];
                  final isLost = item["status"] == "Lost";

                  return AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    margin: const EdgeInsets.only(bottom: 16),
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(22),
                      gradient: LinearGradient(
                        colors: [
                          Colors.white.withOpacity(0.08),
                          Colors.white.withOpacity(0.03),
                        ],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      border: Border.all(
                        color: isLost
                            ? Colors.redAccent.withOpacity(0.4)
                            : Colors.greenAccent.withOpacity(0.4),
                        width: 1,
                      ),


                    ),
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 30,
                          backgroundColor:
                          isLost ? Colors.redAccent : Colors.greenAccent,
                          child: Icon(
                            item["type"] == "Person"
                                ? Icons.person
                                : Icons.inventory_2,
                            color: Colors.black,
                            size: 28,
                          ),
                        ),
                        const SizedBox(width: 18),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(item["title"],
                                  style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 18,
                                      fontWeight: FontWeight.bold)),
                              const SizedBox(height: 6),
                              Text(item["desc"],
                                  style: const TextStyle(
                                      color: Colors.white70, fontSize: 14)),
                              const SizedBox(height: 6),
                              Text("📞 ${item["contact"]}",
                                  style: const TextStyle(
                                      color: Colors.white54, fontSize: 13)),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(14),
                            gradient: LinearGradient(
                              colors: isLost
                                  ? [Colors.redAccent, Colors.red.shade900]
                                  : [Colors.greenAccent, Colors.green.shade900],
                            ),
                          ),
                          child: Text(item["status"],
                              style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.w600)),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Report Dialog
  void _openReportDialog() {
    XFile? _pickedImage; // to hold selected image

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setDialogState) {
            return Dialog(
              backgroundColor: Colors.black.withOpacity(0.9),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: SingleChildScrollView(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text(
                        " Report Lost / Found",
                        style: TextStyle(
                          color: Colors.tealAccent,
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Name
                      TextField(
                        controller: _nameController,
                        style: const TextStyle(color: Colors.white),
                        decoration: const InputDecoration(
                          labelText: "Name",
                          labelStyle: TextStyle(color: Colors.white70),
                          prefixIcon: Icon(Icons.person, color: Colors.white70),
                          enabledBorder: OutlineInputBorder(
                            borderSide: BorderSide(color: Colors.white24),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderSide: BorderSide(color: Colors.tealAccent),
                          ),
                        ),
                      ),

                      const SizedBox(height: 16),

                      // Contact Number
                      TextField(
                        controller: _contactController,
                        style: const TextStyle(color: Colors.white),
                        decoration: const InputDecoration(
                          labelText: "Contact Number",
                          labelStyle: TextStyle(color: Colors.white70),
                          prefixIcon: Icon(Icons.phone, color: Colors.white70),
                          enabledBorder: OutlineInputBorder(
                            borderSide: BorderSide(color: Colors.white24),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderSide: BorderSide(color: Colors.tealAccent),
                          ),
                        ),
                      ),

                      const SizedBox(height: 16),

                      // Type Dropdown
                      DropdownButtonFormField<String>(
                        value: _selectedType,
                        dropdownColor: Colors.black,
                        style: const TextStyle(color: Colors.white),
                        decoration: const InputDecoration(
                          labelText: "Type",
                          labelStyle: TextStyle(color: Colors.white70),
                        ),
                        items: ["Item", "Person"]
                            .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                            .toList(),
                        onChanged: (val) => setState(() => _selectedType = val!),
                      ),

                      const SizedBox(height: 16),

                      // Status Dropdown
                      DropdownButtonFormField<String>(
                        value: _selectedStatus,
                        dropdownColor: Colors.black,
                        style: const TextStyle(color: Colors.white),
                        decoration: const InputDecoration(
                          labelText: "Status",
                          labelStyle: TextStyle(color: Colors.white70),
                        ),
                        items: ["Lost", "Found"]
                            .map((e) => DropdownMenuItem(value: e, child: Text(e)))
                            .toList(),
                        onChanged: (val) => setState(() => _selectedStatus = val!),
                      ),

                      const SizedBox(height: 16),

                      // Description
                      TextField(
                        controller: _descController,
                        maxLines: 3,
                        style: const TextStyle(color: Colors.white),
                        decoration: const InputDecoration(
                          labelText: "Description",
                          labelStyle: TextStyle(color: Colors.white70),
                          prefixIcon: Icon(Icons.description, color: Colors.white70),
                          enabledBorder: OutlineInputBorder(
                            borderSide: BorderSide(color: Colors.white24),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderSide: BorderSide(color: Colors.tealAccent),
                          ),
                        ),
                      ),

                      const SizedBox(height: 16),

                      // Photo Picker
                      InkWell(
                        onTap: () async {
                          final ImagePicker picker = ImagePicker();
                          final image = await picker.pickImage(source: ImageSource.gallery);
                          if (image != null) {
                            setDialogState(() => _pickedImage = image);
                          }
                        },
                        child: Container(
                          height: 150,
                          width: double.infinity,
                          decoration: BoxDecoration(
                            border: Border.all(color: Colors.white24),
                            borderRadius: BorderRadius.circular(12),
                            color: Colors.white10,
                          ),
                          child: _pickedImage == null
                              ? const Center(
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(Icons.add_a_photo, color: Colors.white70, size: 40),
                                SizedBox(height: 8),
                                Text("Add Photo",
                                    style: TextStyle(color: Colors.white70)),
                              ],
                            ),
                          )
                              : ClipRRect(
                            borderRadius: BorderRadius.circular(12),
                            child: Image.file(
                              File(_pickedImage!.path),
                              fit: BoxFit.cover,
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Buttons
                      Row(
                        children: [
                          Expanded(
                            child: TextButton(
                              onPressed: () => Navigator.pop(context),
                              child: const Text("Cancel", style: TextStyle(color: Colors.grey)),
                            ),
                          ),
                          Expanded(
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.tealAccent,
                                foregroundColor: Colors.black,
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.circular(12)),
                                padding: const EdgeInsets.symmetric(vertical: 14),
                              ),
                              onPressed: () {
                                setState(() {
                                  _items.add({
                                    "title": _nameController.text.isNotEmpty
                                        ? _nameController.text
                                        : (_selectedType == "Person"
                                        ? "Person Report"
                                        : "Item Report"),
                                    "desc": _descController.text,
                                    "status": _selectedStatus,
                                    "contact": _contactController.text,
                                    "type": _selectedType,
                                    "image": _pickedImage?.path,
                                  });
                                });
                                Navigator.pop(context);
                              },
                              child: const Text("Submit",
                                  style: TextStyle(fontWeight: FontWeight.bold)),
                            ),
                          ),
                        ],
                      )
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

}
