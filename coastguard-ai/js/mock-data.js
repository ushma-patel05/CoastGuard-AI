// ============================================================
// CoastGuard AI — Mock / Demo Data
// ALL DATA IS FICTIONAL & SIMULATED — NOT REAL-TIME
// ============================================================

const MOCK_DATA = {

  // ── Cyclone ────────────────────────────────────────────────
  cyclone: {
    name: "Cyclone VAYU-2",
    category: 3,
    status: "Active",
    riskLevel: "HIGH",
    windSpeed: 118,
    gustSpeed: 145,
    pressure: 972,
    direction: "NNE",
    landfallProbability: 72,
    estimatedLandfall: "36–42 hours",
    origin: "Arabian Sea",
    latitude: 18.4,
    longitude: 68.2,
    radius: 250,
    districtsAtRisk: 7,
    lastUpdated: "Demo — simulated data"
  },

  // ── Districts ──────────────────────────────────────────────
  districts: [
    { id: "kutch",      name: "Kutch",             risk: "CRITICAL", population: 8200000, windSpeed: 105, evacuation: 68, shelters: 12, fishermen: 3800, coastal: true,  x: 95,  y: 95  },
    { id: "dwarka",     name: "Devbhumi Dwarka",   risk: "HIGH",     population: 780000,  windSpeed: 98,  evacuation: 54, shelters: 8,  fishermen: 2100, coastal: true,  x: 118, y: 148 },
    { id: "jamnagar",   name: "Jamnagar",           risk: "HIGH",     population: 2900000, windSpeed: 95,  evacuation: 47, shelters: 10, fishermen: 1900, coastal: true,  x: 148, y: 165 },
    { id: "porbandar",  name: "Porbandar",          risk: "CRITICAL", population: 590000,  windSpeed: 112, evacuation: 71, shelters: 6,  fishermen: 2600, coastal: true,  x: 130, y: 198 },
    { id: "junagadh",   name: "Junagadh",           risk: "HIGH",     population: 2450000, windSpeed: 88,  evacuation: 42, shelters: 9,  fishermen: 1400, coastal: true,  x: 158, y: 215 },
    { id: "girsoma",    name: "Gir Somnath",        risk: "HIGH",     population: 1220000, windSpeed: 91,  evacuation: 55, shelters: 7,  fishermen: 1800, coastal: true,  x: 178, y: 228 },
    { id: "amreli",     name: "Amreli",             risk: "MEDIUM",   population: 1513000, windSpeed: 62,  evacuation: 30, shelters: 6,  fishermen: 600,  coastal: true,  x: 195, y: 218 },
    { id: "bhavnagar",  name: "Bhavnagar",          risk: "MEDIUM",   population: 2880000, windSpeed: 58,  evacuation: 28, shelters: 8,  fishermen: 900,  coastal: true,  x: 218, y: 205 },
    { id: "bharuch",    name: "Bharuch",            risk: "LOW",      population: 1550000, windSpeed: 35,  evacuation: 12, shelters: 5,  fishermen: 300,  coastal: true,  x: 245, y: 195 },
    { id: "surat",      name: "Surat",              risk: "LOW",      population: 6100000, windSpeed: 32,  evacuation: 10, shelters: 7,  fishermen: 250,  coastal: true,  x: 262, y: 208 },
    { id: "navsari",    name: "Navsari",            risk: "LOW",      population: 1340000, windSpeed: 28,  evacuation: 8,  shelters: 4,  fishermen: 180,  coastal: true,  x: 270, y: 228 },
    { id: "valsad",     name: "Valsad",             risk: "LOW",      population: 1705000, windSpeed: 25,  evacuation: 6,  shelters: 4,  fishermen: 140,  coastal: true,  x: 272, y: 248 }
  ],

  // ── Vessels (Fishermen) ────────────────────────────────────
  vessels: [
    { id: "CG-001", name: "CG-001 — Sagar Moti",    status: "SAFE",      district: "Porbandar", lat: 20.8, lon: 69.1, crew: 8,  distance: 12, lastContact: "2 min ago"  },
    { id: "CG-002", name: "CG-002 — Deep Sea Raja",  status: "WARNING",   district: "Kutch",     lat: 22.3, lon: 67.8, crew: 12, distance: 45, lastContact: "5 min ago"  },
    { id: "CG-003", name: "CG-003 — Neel Gagan",     status: "SAFE",      district: "Jamnagar",  lat: 21.5, lon: 68.5, crew: 6,  distance: 8,  lastContact: "1 min ago"  },
    { id: "CG-004", name: "CG-004 — Samudra Shakti", status: "HIGH RISK", district: "Dwarka",    lat: 22.1, lon: 67.2, crew: 15, distance: 78, lastContact: "18 min ago" },
    { id: "CG-005", name: "CG-005 — Coastal Pride",  status: "SAFE",      district: "Porbandar", lat: 21.0, lon: 69.5, crew: 9,  distance: 5,  lastContact: "3 min ago"  },
    { id: "CG-006", name: "CG-006 — Tara Maa",       status: "WARNING",   district: "Junagadh",  lat: 20.7, lon: 70.2, crew: 7,  distance: 38, lastContact: "8 min ago"  },
    { id: "CG-007", name: "CG-007 — Jai Bhavani",    status: "SAFE",      district: "Bhavnagar", lat: 20.2, lon: 71.4, crew: 10, distance: 15, lastContact: "4 min ago"  },
    { id: "CG-008", name: "CG-008 — Blue Horizon",   status: "HIGH RISK", district: "Kutch",     lat: 23.1, lon: 66.9, crew: 14, distance: 95, lastContact: "25 min ago" }
  ],

  // ── Shelters ───────────────────────────────────────────────
  shelters: [
    { id: "SH-01", name: "Coastal Shelter Alpha",  district: "Kutch",    capacity: 35000, occupied: 12400, distance: 4.8, travelTime: 18, route: "SAFE",   type: "Primary"   },
    { id: "SH-02", name: "Mandvi Relief Camp",     district: "Kutch",    capacity: 18000, occupied: 5200,  distance: 8.2, travelTime: 28, route: "SAFE",   type: "Secondary" },
    { id: "SH-03", name: "Dwarka Community Hall",  district: "Dwarka",   capacity: 12000, occupied: 3800,  distance: 3.5, travelTime: 14, route: "SAFE",   type: "Primary"   },
    { id: "SH-04", name: "Porbandar Civic Centre", district: "Porbandar",capacity: 22000, occupied: 8900,  distance: 2.1, travelTime: 9,  route: "SAFE",   type: "Primary"   },
    { id: "SH-05", name: "Junagadh Stadium",       district: "Junagadh", capacity: 28000, occupied: 6100,  distance: 6.4, travelTime: 22, route: "CAUTION",type: "Primary"   },
    { id: "SH-06", name: "Bhavnagar Arena",        district: "Bhavnagar",capacity: 25000, occupied: 4800,  distance: 5.8, travelTime: 20, route: "SAFE",   type: "Secondary" }
  ],

  // ── Resources ──────────────────────────────────────────────
  resources: [
    { id: "food",    name: "Food Packets",   available: 12500, required: 15000, unit: "packets", status: "WARNING" },
    { id: "medical", name: "Medical Kits",   available: 2800,  required: 2500,  unit: "kits",    status: "READY"   },
    { id: "boats",   name: "Rescue Boats",   available: 28,    required: 35,    unit: "boats",   status: "WARNING" },
    { id: "shelter", name: "Shelter Units",  available: 42,    required: 38,    unit: "units",   status: "READY"   },
    { id: "water",   name: "Water Tankers",  available: 85,    required: 100,   unit: "tankers", status: "WARNING" },
    { id: "power",   name: "Power Generators", available: 34,  required: 30,    unit: "units",   status: "READY"   }
  ],

  // ── Alerts ─────────────────────────────────────────────────
  alerts: [
    { id: 1, level: "HIGH",    icon: "🔴", title: "Cyclone VAYU-2 Approaching",          msg: "Category 3 cyclone tracking toward coastal Gujarat. Landfall expected in 36–42 hours. All coastal districts on high alert.",      time: "14:32"  },
    { id: 2, level: "WARNING", icon: "🟠", title: "Fishermen Advisory Issued",            msg: "All fishing vessels advised to return to safe harbor immediately. Do not venture beyond 12 nautical miles from coast.",           time: "14:28"  },
    { id: 3, level: "WARNING", icon: "🟠", title: "Evacuation Order — Kutch & Porbandar", msg: "Mandatory evacuation ordered for coastal zones in Kutch and Porbandar. Citizens to proceed to designated shelters.",             time: "14:15"  },
    { id: 4, level: "WATCH",   icon: "🟡", title: "Heavy Rainfall Alert",                 msg: "Red alert issued for heavy to very heavy rainfall along Gujarat coastline. Flash flood risk in low-lying areas.",                 time: "13:50"  },
    { id: 5, level: "WATCH",   icon: "🟡", title: "High Wave Warning",                    msg: "Wave heights of 4–6 meters expected. All coastal activities suspended. Beach areas closed.",                                     time: "13:40"  },
    { id: 6, level: "INFO",    icon: "🔵", title: "Rescue Teams Deployed",                msg: "NDRF teams deployed across 5 coastal districts. 28 rescue boats operational. Medical response units on standby.",                time: "13:20"  }
  ],

  // ── Agent Analysis Results ─────────────────────────────────
  agentResults: {
    cyclone: {
      title: "Cyclone Intelligence Analysis",
      riskLevel: "HIGH",
      confidence: 92,
      windSpeed: "118 km/h",
      landfallProbability: "72%",
      timeToLandfall: "36–42 hours",
      action: "Issue RED ALERT. Activate evacuation protocols for Kutch, Porbandar, Dwarka, and Jamnagar. Position NDRF teams at coastal staging areas.",
      details: ["Category 3 cyclone moving NNE at 14 km/h", "Pressure gradient intensifying — 972 hPa", "Sea surface temperature above 29°C fueling intensification", "Landfall window: 36–42 hours from simulation start"]
    },
    fishermen: {
      title: "Fishermen Safety Analysis",
      riskLevel: "HIGH",
      confidence: 89,
      vesselsAtRisk: 3,
      totalVessels: 8,
      criticalVessels: "CG-004, CG-008",
      action: "Immediate recall of CG-004 and CG-008. Coast Guard vessel dispatch authorized. Emergency radio broadcast on channel 16.",
      details: ["8 vessels tracked in simulated zone", "2 vessels in HIGH RISK zone (>70 km offshore)", "2 vessels in WARNING zone (30–70 km offshore)", "4 vessels safely returned or near shore"]
    },
    evacuation: {
      title: "Evacuation Planning Analysis",
      riskLevel: "HIGH",
      confidence: 87,
      populationAtRisk: "2.8M",
      shelterCapacity: "1.4M",
      completionTime: "28 hours",
      action: "Activate phased evacuation — Zone A (0–5 km) immediate, Zone B (5–15 km) within 12 hrs. Deploy 420 buses. Open NH-48 and SH-6 as evacuation corridors.",
      details: ["Priority Zone A: 0–5 km coastal belt — 580,000 persons", "Priority Zone B: 5–15 km belt — 1.2M persons", "42 shelters identified with combined capacity 1.4M", "Estimated completion: 28 hours with full resource deployment"]
    },
    relief: {
      title: "Relief Coordination Analysis",
      riskLevel: "MEDIUM",
      confidence: 84,
      gap: "Food packets deficit: 2,500",
      action: "Request emergency food supply replenishment from Gandhinagar. Pre-position medical kits in Kutch and Porbandar. Dispatch 7 additional rescue boats from Surat.",
      details: ["Food packets: 12,500 available vs 15,000 required", "Medical kits: 2,800 available — adequate", "Rescue boats: 28 available vs 35 required", "Water tankers: 85 available — 15 additional needed"]
    },
    damage: {
      title: "Damage Assessment Analysis",
      riskLevel: "HIGH",
      confidence: 78,
      buildingsDamaged: 128,
      roadDamage: "34%",
      agricultureDamage: "21%",
      infrastructureDamage: "18%",
      action: "Deploy structural assessment teams to high-risk zones. Prioritize road clearance on NH-8A. Activate crop insurance protocols for Kutch and Junagadh.",
      details: ["Simulated post-cyclone scenario — Category 3 landfall", "128 structures assessed as damaged or destroyed", "34% road network disruption in coastal belt", "Agricultural loss estimated at ₹280 Cr in demo scenario"]
    }
  },

  // ── Damage Assessment ──────────────────────────────────────
  damageResults: [
    { label: "Buildings Damaged",       value: 128,  unit: "",  severity: "HIGH"   },
    { label: "Road Damage",             value: 34,   unit: "%", severity: "HIGH"   },
    { label: "Agriculture Damage",      value: 21,   unit: "%", severity: "MEDIUM" },
    { label: "Infrastructure Damage",   value: 18,   unit: "%", severity: "MEDIUM" },
    { label: "Estimated Loss",          value: "₹280 Cr (Demo)", unit: "", severity: "HIGH" }
  ],

  // ── Stats (Home) ───────────────────────────────────────────
  stats: {
    coastlineKm: 1600,
    coastalDistricts: 12,
    populationAtRisk: 50,
    aiAgents: 5
  },

  // ── Command Center Live Values ────────────────────────────
  commandCenter: {
    cyclonerisk: "HIGH",
    fishermenAtRisk: 1284,
    coastalDistricts: 12,
    activeAlerts: 7,
    sheltersAvailable: 42,
    rescueBoats: 28,
    windSpeed: 118,
    riskScore: 87
  }
};

// Expose globally
window.MOCK_DATA = MOCK_DATA;
