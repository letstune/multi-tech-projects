const getDevotees = (req, res) => {
  const mockDevotees = [
    {
      _id: "1",
      name: "Rajesh Kumar",
      age: 45,
      gender: "Male",
      phone: "+91-9876543210",
      address: "Delhi, India",
      registrationDate: "2024-01-20T08:30:00Z",
      currentLocation: "Main Bathing Ghat",
      qrCode: "QR001RAJESH",
      safetyStatus: "safe",
      checkInTime: "2024-01-20T09:15:00Z",
      emergencyContact: {
        name: "Priya Kumar",
        phone: "+91-9876543211",
        relation: "Wife",
      },
      medicalInfo: {
        conditions: ["None"],
        medications: ["None"],
        bloodType: "B+",
      },
    },
    {
      _id: "2",
      name: "Sunita Devi",
      age: 38,
      gender: "Female",
      phone: "+91-9876543212",
      address: "Mumbai, India",
      registrationDate: "2024-01-20T07:45:00Z",
      currentLocation: "Puja Kendra Central",
      qrCode: "QR002SUNITA",
      safetyStatus: "safe",
      checkInTime: "2024-01-20T08:30:00Z",
      emergencyContact: {
        name: "Ramesh Devi",
        phone: "+91-9876543213",
        relation: "Husband",
      },
      medicalInfo: {
        conditions: ["Diabetes"],
        medications: ["Metformin"],
        bloodType: "A+",
      },
    },
    {
      _id: "3",
      name: "Amit Sharma",
      age: 28,
      gender: "Male",
      phone: "+91-9876543214",
      address: "Jaipur, India",
      registrationDate: "2024-01-20T06:00:00Z",
      currentLocation: "Rest Zone 1",
      qrCode: "QR003AMIT",
      safetyStatus: "at_risk",
      checkInTime: "2024-01-20T07:00:00Z",
      emergencyContact: {
        name: "Vijay Sharma",
        phone: "+91-9876543215",
        relation: "Father",
      },
      medicalInfo: {
        conditions: ["Asthma"],
        medications: ["Inhaler"],
        bloodType: "O+",
      },
    },
  ];
  res.json({ success: true, data: mockDevotees });
};

const addDevotee = (req, res) => {
  const newDevotee = {
    ...req.body,
    _id: Date.now().toString(),
    registrationDate: new Date().toISOString(),
    qrCode: `QR${Date.now()}${req.body.name.substring(0, 3).toUpperCase()}`,
    safetyStatus: "safe",
  };
  res.status(201).json({ success: true, data: newDevotee });
};

const updateDevotee = (req, res) => {
  const updatedDevotee = {
    ...req.body,
    _id: req.params.id,
    lastUpdated: new Date().toISOString(),
  };
  res.json({ success: true, data: updatedDevotee });
};

const deleteDevotee = (req, res) => {
  res.json({ success: true, message: "Devotee deleted successfully" });
};

const getDevoteeById = (req, res) => {
  const mockDevotee = {
    _id: req.params.id,
    name: "Sample Devotee",
    age: 35,
    gender: "Male",
    phone: "+91-9876543210",
    address: "Sample Address",
    registrationDate: new Date().toISOString(),
    currentLocation: "Main Bathing Ghat",
    qrCode: `QR${req.params.id}SAMPLE`,
    safetyStatus: "safe",
    emergencyContact: {
      name: "Emergency Contact",
      phone: "+91-9876543211",
      relation: "Family",
    },
  };
  res.json({ success: true, data: mockDevotee });
};

const getDevoteeAnalytics = (req, res) => {
  const analytics = {
    totalRegistered: 15420,
    currentlyPresent: 12850,
    safetyStatus: {
      safe: 12650,
      at_risk: 180,
      emergency: 20,
    },
    demographics: {
      male: 8200,
      female: 6850,
      children: 370,
    },
    locations: {
      "Main Bathing Ghat": 4200,
      "Puja Kendra Central": 3800,
      "Food Courts": 2100,
      "Rest Zones": 1850,
      Other: 900,
    },
  };
  res.json({ success: true, data: analytics });
};

module.exports = {
  getDevotees,
  addDevotee,
  updateDevotee,
  deleteDevotee,
  getDevoteeById,
  getDevoteeAnalytics,
};
