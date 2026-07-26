import React, { useState } from "react";

// ----- EXPORTED PRODUCT DATA (used by App.jsx for URL resolution) -----
export const catalogItems = [
  // ----- Casual & Outdoor Wear -----
  {
    id: "p1",
    category: "Casual & Outdoor Wear",
    title: "Balaclava",
    ticketPrice: 4,
    marketPrice: 65,
    description: "Tactical Lightweight Hinged Balaclava\n\n• Material & Fabric Construction\nMaterial Composition: 95% High-Density Polyester / 5% Spandex\nFabric Weight: Ultra-lightweight (~40g to 45g)\nProperties: Moisture-wicking, quick-drying, breathable, and anti-static\n\n• Operational Features & Compatibility\nProtection: Blocks dust, wind, mild cold, and harmful UV rays\nAnti-Fogging: Breathable mesh structure helps disperse warm breath to reduce goggle/eyewear fogging\nHelmet Compatibility: Designed as a low-drag inner layer for tactical helmets (FAST/MICH), motorcycle helmets, or bicycle helmets\n​Full Face Balaclava (Head, neck, and face coverage)",
    image: "/Balaclava.jpg",
    images: [
      "/Balaclava.jpg",
      "/Balaclava1.jpg",
      "/Balaclava2.jpg",
      "/Balaclava3.jpg",
    ],
  },
  {
    id: "p2",
    category: "Casual & Outdoor Wear",
    title: "Western boots",
    ticketPrice: 4,
    marketPrice: 80,
    description: "Different sizes & colors in stock.",
    image: "/Western Boots  Gld.jpg",
    images: [
      "/Western Boots  Gld.jpg",
      "/Western Boots Bla1.jpg",
      "/Western Boots Blu3.jpg",
      "/Western Boots Bro1.jpg",
      "/Western Boots Gld2.jpg",
    ],
  },

  // ----- Sports -----
  {
    id: "p3",
    category: "Sports",
    title: "Club Car DS",
    ticketPrice: 10,
    marketPrice: 500,
    description: "• General & Dimensions\nModel: Club Car DS (2-Passenger)\nOverall Length: 91.5 inches (232 cm)\nOverall Width: 48.75 inches (123.8 cm)\nOverall Height (with canopy): 69.0 – 71.0 inches (175–180 cm)\nVehicle Load Capacity: 500 lbs (226kg)\n\n• Chassis & Body\nFrame: AlumiCore™ lightweight, rustproof ladder-style aluminum box beam frame\nBody Finish: ArmorFlex® injection-molded composite with UV protection*\n​Front Suspension: Independent leaf spring with dual hydraulic shocks\nRear Suspension: Leaf spring with dual hydraulic shocks\nSteering: SportDrive™ self-compensating double-reduction helical rack & pinion\nBrakes: Rear-wheel mechanical drum brakes with foot-actuated 3-position parking brake\nStandard Tires: 18 × 8.50 – 8 (4-ply rated)\n\n• Powertrain\nMotor: 3.3 HP to 3.7 HP DC electric motor\nPower system: 48-Volt PowerDrive\nBatteries: four 12V batteries (48V system)\nCurb Weight: ~910 lbs – 975 lbs (including lead-acid batteries)\nTop Speed: 12 – 15 mph (Standard)",
    image: "/Golf car.png",
    images: [
      "/Golf car.png",
      "/Golf car1.png",
      "/Golf car2.png",
      "/Golf car3.jpg",
    ],
  },
  {
    id: "p4",
    category: "Sports",
    title: "G1 Virtual Reality Headset",
    ticketPrice: 5,
    marketPrice: 250,
    description: "• Display & Optics\nDisplay Type: Dual 2.89-inch LCD panels (RGB stripe subpixels\nResolution: 2160 \times 2160 pixels per eye (4320 \times 2160 combined)\nRefresh Rate: 90 Hz\nField of View (FOV): 114° diagonal (~95° horizontal)\nLenses: Dual Fresnel lenses\nInterpupillary Distance (IPD): Fixed hardware at 63 mm (software-adjustable IPD offset)\n\n• Tracking & Sensors\nTracking Type: 6 Degrees of Freedom (6 DoF) Inside-Out Tracking\nCameras: 2 Front-facing visible spectrum cameras\nSensors: Integrated gyroscope, accelerometer, and magnetometer\n\n• Audio & Connectivity\nAudio System: Integrated spatial audio with removable headphones\nMicrophone: Dual integrated noise-canceling smart assistant microphones\nCable Connection: 2-in-1 cable with DisplayPort 1.3 and USB 3.0\n\n• Controllers (WMR 1st-Gen)\nTracking: 6 DoF tracked via LED constellation rings\nConnectivity: Bluetooth 4.0 (pre-synced to the headset)\nPower Source: 2× AA batteries per controller",
    image: "/G2 virtual reality headset.png",
    images: [
      "/G2 virtual reality headset.png",
      "/G2 virtual reality headset1.png",
      "/G2 virtual reality headset2.png",
    ],
  },
  {
    id: "p5",
    category: "Sports",
    title: "Yamaha Jetski",
    ticketPrice: 8,
    marketPrice: 650,
    description: "• Engine & Performance\nEngine Type: 1052cc, 4-Stroke, 4-Cylinder, DOHC (20 Valves) Yamaha MR-1 Marine Engine\nHorsepower: ~102 HP @ 8,000 RPM\nCompression Ratio: 11.4:1\nInduction / Fuel System: Electronic Fuel Injection (EFI)\nCooling System: Open-loop, water-cooled\nTop Speed: ~52 – 54 mph\n\n• Drive Unit & Propulsion\nPump Type: 155 mm Axial Flow, Single-Stage\nImpeller: 3-Blade Stainless Steel\nReverse System: Manual Reverse Bucket with Left-Side Lever\nSteering Assist: Yamaha Off-Throttle Steering (OTS)\n\n• Dimensions & Capacities\nOverall Length: 126.8 inches (3,220 mm)\nOverall Width: 46.1 inches (1,170 mm)\nOverall Height: 45.3 inches (1,150 mm)\n​Dry Weight: 716 lbs (325 kg)\nRider Capacity: 1–3 Persons (Max Weight: 530 lbs / 240 kg)\nFuel Tank Capacity: 15.9 Gallons (60 Liters)\nTotal Storage Capacity: 17.8 Gallons / 67.4 Liters (Front Bow Storage + Glovebox)\nInstrumentation: Digital Multi-Function Display (Speedometer, Tachometer, Fuel Level, Hour Meter)",
    image: "/Jetski.png",
    images: [
      "/Jetski.png",
      "/Jetski1.png",
      "/Jetski2.png",
      "/Jetski4.png",
    ],
  },
  {
    id: "p21",
    category: "Sports",
    title: "4D-V15 Drone Zeros Mini Quadcopter",
    ticketPrice: 5,
    marketPrice: 75,
    description: "• Camera & Imaging\nPrimary Front Camera - 1080P HD\nBottom Camera - Basic optical flow secondary camera\nTransmission - 2.4GHz Wi-Fi FPV feed directly to a smartphone app up to ~80 meters away\n\n• Battery Capacity & Power\nBattery Type - Modular, plug-in 3.7V Lithium Battery\nCapacity - 1200mAh\nCharging time - Approximately 90min\n\n• Propellers & Motors\nPropellers - Lightweight, flexible 2-blade plastic propellers\nProtective Guards - Comes with 4 snap-on propeller guard frames to prevent blade damage during indoor crashes\n\n• Flexibility, Flight Modes & Controls\nFoldability - Highly compact & foldable\n360° Stunt Flips - Dedicated button to perform automatic aerial flips\nOptical Flow & Altitude Hold - Automatically hovers in place using its bottom camera sensor\nGesture Control - Take photos/videos using hand gestures (peace sign / open palm)\nTrajectory Flight - Draw a line on the smartphone screen for the drone to follow\nComes with instruction manual and accessories\nThe V15 mini drone captures great in-flight pictures and videos.\n\nPerfect working condition.",
    image: "/Drone zeros.png",
    images: [
      "/Drone zeros.png",
      "/Drone zeros1.png",
      "/Drone zeros2.png",
      "/Drone zeros3.png",
      "/Drone zeros4.png",
      "/Drone zeros5.png",
    ],
  },
  {
    id: "p6",
    category: "Sports",
    title: "Surfboard",
    ticketPrice: 4,
    marketPrice: 200,
    description: `Wavestorm 8ft Classic Soft-Top Surfboards\n\n• Dimensions & Capacities\nLength: 8 ft (96 in / 243.8 cm)\nWidth: 22.5 in (57.1 cm)\nThickness: 3.25 in (8.25 cm)\nVolume: 86 Liters\nBoard Weight: ~11.5 lbs (5.2 kg)\n\n• Core Construction & Materials\nCore: High-density EPS (Expanded Polystyrene) foam core\nStringer System: 3× Marine-ply wood stringers (provides rigidity and flex control)\nDecking Skin: Soft WBS-IXL (Water Barrier Skin) cross-linked foam deck with UV-inhibiting graphics\nBottom Slick: High-Density Polyethylene (HDPE) high-speed slick bottom skin\n\n• Hardware & Accessories Included\nFin Setup: Thruster setup (3× 4.5" bolt-through removable fins)\nTraction Pad: Textured EVA tail traction pad pre-installed\nLeash: Removable polyurethane ankle leash with pre-installed leash plug`,
    image: "/Surfboard1.png",
    images: [
      "/Surfboard1.png",
      "/Surfboard2.png",
      "/Surfboard3.png",
    ],
  },

  // ----- Electronics -----
  {
    id: "p7",
    category: "Electronics",
    title: "Treadmill Proform Carbon",
    ticketPrice: 8,
    marketPrice: 600,
    description: `• Motor & Drive System\nMotor: 2.6 CHP (Continuous Horsepower) Mach Z™ / Quiet Drive Motor\nSpeed Range: 0 – 10 MPH (0 – 16 km/h) with QuickSpeed® digital control buttons\nIncline Range: 0% – 10% Powered Incline with QuickIncline® controls\n\n• Running Deck & Cushioning\nRunning Surface / Belt Size: 20" W × 55" L (46 cm × 140 cm)\nCushioning: ProShox™ Deck Cushioning (absorbs landing impact)\nRollers: 1.9" Precision-Balanced Non-Flex Rollers\n\n• Display, Audio & Connectivity\nDisplay: 5-inch High-Contrast Backlit LCD Display\nApp Integration: iFIT Enabled (Bluetooth sync for trainer-led auto-adjusting workouts)\nAudio: Dual 2-inch Bluetooth speakers\nHeart Rate: Bluetooth Smart HR Monitor compatible (no pulse grips on console)\nConvenience Extras: Integrated tablet/device ledge, dual water bottle holders\n\n• Frame & Dimensions\nDesign: SpaceSaver® Folding Design with EasyLift™ Assist hydraulic release mechanism\nAssembled Footprint: 65" L × 35" W × 64" H (165 cm × 89 cm × 163 cm)\nMaximum User Capacity: 300 lbs (136 kg)\nProduct Weight: ~186 lbs (84 kg)\nMore models available.`,
    image: "/treadmill.png",
    images: [
      "/treadmill1.png",
      "/treadmill2.png",
      "/treadmill3.png",
      "/treadmill5.png",
    ],
  },
  {
    id: "p8",
    category: "Electronics",
    title: "Mokwheel Mesa Lite e-bikes",
    ticketPrice: 7,
    marketPrice: 500,
    description: `• Motor & Electronics\nMotor: 350W Rear Hub Motor (Peak Power: 600W / 45+ Nm Torque)\nBattery: 36V 14.7Ah LG Lithium-Ion (IPX7 Waterproof rating)\nTop Speed: Up to 20 MPH (Throttle) / 25–28 MPH (Pedal Assist)\nEstimated Range: 40 – 50 miles per charge\nPedal Assist / Drive: Cadence Sensor with 5 PAS Levels + Thumb Throttle\nCharger: 36V 2.0A Smart Charger\n\n• Drivetrain, Suspension & Brakes\nGearing: Shimano 7-Speed Derailleur & Shifter\nCrankset: Aluminum Alloy, 170 mm, 44T Chainring\nBrakes: ZOOM Mechanical Dual-Pull Disc Brakes\nFront Fork: 100 mm Suspension Fork\nTires: 27.5" × 2.4" City / Urban All-Terrain Tires\n\n• Frame & Dimensions\nFrame Material: 6061 Aluminum Alloy Step-Thru Frame\nMax Payload Capacity: 350 lbs (158 kg)\nRider Height Compatibility: 5'2" to 6'4"\nAccessories Included: Front headlight, rear integrated brake light, front cargo basket with wooden base, rear rack with trunk bag, full-coverage fenders, and side mirrors.`,
    image: "/Ebikes.png",
    images: [
      "/Ebikes.png",
      "/Ebikes9.png",
      "/Ebikes5.png",
      "/Ebikes8.png",
      "/Ebikes7.png",
      "/Ebikes6.png",
    ],
  },
  {
    id: "p9",
    category: "Electronics",
    title: "Sightmark wraith night vision scope.",
    ticketPrice: 5,
    marketPrice: 350,
    description: `• Optics & Sensor\nSensor Type & Resolution: 1920 \times 1080 CMOS Sensor\nDisplay Type & Resolution: 1280 \times 720 FLCOS Display\nOptical Magnification: 4x\nDigital Zoom: 1\text{x} - 8\text{x} (total magnification up to 32x)\nField of View: 21 ft @ 100 yards (7m @ 100 m)\nDiopter Adjustment: -6 to +3\n\n• IR Illuminator & Night Range\n​IR Wavelength: 850 nm (Removable IR Flashlight included)\nNight Vision Detection Range: Up to 200 yards (183 meters)\nIR Battery Type: 2× CR123A batteries\n\n• Video & Recording\nVideo Recording Resolution: 1080p HD / 720p HD (AVI format)\nPhoto Resolution: JPEG format\nStorage Support: MicroSD card slot (supports up to 64GB)\nOutput Port: Micro-USB port for video export and external power\n\n• Power & Construction\nPower Supply (Scope): 4× AA batteries\nBattery Life (Scope): ~3.5 hours (recording mode) / ~4.5 hours (preview mode)\nWater Resistance Rating: IP55 (water-resistant)\nDimensions (L × W × H): 10.5" × 1.875" × 3.0" (266 mm × 63 mm × 75 mm)\nWeight: 36.3 oz / 1030 g (including batteries)`,
    image: "/Night vision scope.png",
    images: [
      "/Night vision scope.png",
      "/Night vision scope1.png",
      "/Night vision scope2.png",
    ],
  },

  // ----- Furniture -----
  {
    id: "p10",
    category: "Furniture",
    title: "Beachcroft Patio Set",
    ticketPrice: 6,
    marketPrice: 400,
    description: "2 Swivel rocking outdoors chairs, fire pit, and 5 pc sectional.\nBrand is Beachcroft.",
    image: "/BeachCroft.png",
    images: [
      "/BeachCroft.png",
      "/BeachCroft1.png",
      "/BeachCroft3.png",
      "/BeachCroft2.png",
    ],
  },
  {
    id: "p11",
    category: "Furniture",
    title: "Kitchen Island",
    ticketPrice: 5,
    marketPrice: 400,
    description: "Kitchen Island.Excellent condition no damages.\nDimensions 1.5m long, 1m wide and 1m high.",
    image: "/Kitchen Island.png",
    images: [
      "/Kitchen Island.png",
      "/Kitchen Island1.png",
      "/Kitchen Island2.png",
    ],
  },
  {
    id: "p12",
    category: "Furniture",
    title: "Stunning Brand Broyhill Patio Set - Like New.",
    ticketPrice: 5,
    marketPrice: 450,
    description: "Elevate your outdoor space with this exquisite Brand Broyhill patio set. Perfect for entertaining, this set comfortably seats 7 and includes a table plus two extra seats, expanding to accommodate up to 9 people. \n\nIt's used only once, it looks like new. \nFree of parties, kids and pets.",
    image: "/Sofa set.jpg",
    images: [
      "/Sofa set.jpg",
      "/Sofa set1.jpg",
      "/Sofa set2.jpg",
    ],
  },
  {
    id: "p13",
    category: "Furniture",
    title: "Light Grey Sectional",
    ticketPrice: 6,
    marketPrice: 500,
    description: "Light Grey weave fabric with piping on edge.It can give a hint of beige with the wood trim.Bought at The Brick, special ordered as colour not shown in store.The legs and bottom is wood trim in a medium to dark stain. This sectional is very heavy and good quality. The extra seat can be attached to make one side longer or used as extra seat like here.\n95”x 95” width and XSeat is 24”width, and all seating 34” in depth (Back to front),\nheight is 34” floor to top of cushion. \nThere is no marks nicks or stains.No pets, no kids, non smoking very clean home! It never gets sat on only when company comes for seasonal holidays! I can show how to connect the extra seat.",
    image: "/light grey cross-sectional.png",
    images: [
      "/light grey cross-sectional.png",
      "/light grey cross-sectional4.png",
      "/light grey cross-sectional5.png",
      "/light grey cross-sectional9.png",
      "/light grey cross-sectional6.png",
      "/light grey cross-sectional2.jpg",
      "/light grey cross-sectional7.png",
    ],
  },
  {
    id: "p14",
    category: "Furniture",
    title: "Power Recliner Set",
    ticketPrice: 6,
    marketPrice: 450,
    description: "Beautiful Sofa set with power recliners and USB charging ports. \nSofas are bonded leather white color fabric. Sofas include easily removable backrests which makes it ideal for transporting and maneuvering around into tight spaces. Sofas are just 6 months old, adult used and considered to be in mint condition.\nSofa is 85 inches long and Loveseat is 63 inches long.",
    image: "/Beautiful Sofa.jpg",
    images: [
      "/Beautiful Sofa.jpg",
      "/Beautiful Sofa1.jpg",
      "/Beautiful Sofa2.jpg",
      "/Beautiful Sofa3.jpg",
    ],
  },
  {
    id: "p15",
    category: "Furniture",
    title: "Modern L - Shaped Sofa",
    ticketPrice: 4,
    marketPrice: 300,
    description: `Comfy 3-seater with reversible storage ottoman\n\n78" D x 53" W x 32" H (seat depth 21", seat height 18.5")\n\nCold beige linen (light gray-ish), sturdy iron frame, soft cushions.\n\nModern, sleek, and super functional.\n\nNo pets, no smoking home.`,
    image: "/Modern L - shaped.jpg",
    images: [
      "/Modern L - shaped.jpg",
      "/Modern L - shaped1.jpg",
      "/Modern L - shaped2.jpg",
    ],
  },

  // ----- Household -----
  {
    id: "p16",
    category: "Household",
    title: "Washer &Dryer",
    ticketPrice: 5,
    marketPrice: 400,
    description: `LG WM3570HVA Front-Load Washer\n\n• Capacity & Dimensions}\nCapacity: 4.3 cu. ft. Ultra Large Capacity\nDimensions (W × H × D): 27" × 38 11/16" × 29 3/4" (51" Depth with door open)
​Weight: 192 lbs\nWeight: 192 lbs\n\n• Performance & Features\nMotor Type: Inverter Direct Drive Motor (10-Year Limited Warranty)\n​Max Spin Speed: 1,300 RPM\nTechnologies: TurboWash® (saves up to 20 mins per load), 6Motion™ Technology, TrueBalance™ Anti-Vibration\nSteam Options: TrueSteam™, AAFA Certified Allergiene™ Cycle, NSF Certified Sanitary Cycle\nWash Programs (12): Cotton/Normal, Bulky/Large, Perm Press, Delicates, Speed Wash, Sanitary, Heavy Duty, BrightWhites™, Towels, Allergiene™, Tub Clean, Downloaded Cycle\nEnergy Rating: ENERGY STAR® Most Efficient\n\nLG DLEX3570V / DLGX3571V Dryer\n\n• Capacity & Dimensions\nCapacity: 7.4 cu. ft. Ultra Capacity\nDimensions (W × H × D): 27" × 38 11/16" × 29 3/4" (51" Depth with door open)\nWeight: 136 lbs\n\n• Performance & Features\nDrying System: Sensor Dry System with Precise Temperature Control\nSteam Features: TrueSteam™, SteamFresh™ Cycle (20-min refresh for up to 5 garments), SteamSanitary™ Cycle\nDrying Programs (12): SteamFresh™, SteamSanitary™, Heavy Duty, Regular/Normal, Bulky/Large, Towels, Perm Press, Delicates, Small Load, Antibacterial, Speed Dry, Air Dry\nDrum Material: Aluminized Alloy Steel Drum (Alcosta) with Interior Light\nPower Requirements: 240V / 30A (Electric model DLEX3570V) or 120V / 15A (Gas model DLGX3571V)`,
    image: "/Washer & Dryer.png",
    images: [
      "/Washer & Dryer.png",
      "/Washer & Dryer1.jpg",
      "/Washer & Dryer2.png",
      "/Washer & Dryer3.png",
    ],
  },
  {
    id: "p17",
    category: "Household",
    title: "Tuff Spas TT650",
    ticketPrice: 5,
    marketPrice: 350,
    description: `• Shell & Seating\nSeating Capacity: 4 – 6 Person (open bucket seating with dual cushioned headrests)\nDimensions: 76.5" L × 76.5" W × 35" H (194 cm × 194 cm × 89 cm)\nWater Capacity: 280 – 310 Gallons (1,060 – 1,173 Liters)\nDry Weight: ~510 – 595 lbs (231 – 270 kg)\nConstruction: Rotationally molded (rotomolded) indestructible resin shell and cabinet\n\n• ​Jet & Pump System\n​Total Jets: 31 Stainless Steel / LPI Directional and Massaging Jets\nPumps: Dual Pump System (1× 2-Speed 10A EE Pump + 1× 1-Speed 3A Auxiliary Pump)\nFiltration: 50 sq. ft. screw-in filter\nFeatures: Built-in 8" Backlit Waterfall, Air Control valves, and Ozone system\n\n• Electrical & Heating\nElectrical Configuration: 110V Convertible (Plug & Play ready)\nSupply Voltage: 115V / 20A dedicated plug (includes 15A GFCI power cord) or 230V / 50A hardwire\nHeater: 1.0 kW @ 110V (Balboa Control System)\nLighting: Multi-color LED lighting package (underwater light, perimeter lights, and illuminated waterfall)\nInsulation: Full foam / Blue sTUFF Denim thermal foil insulation`,
    image: "/Eco Spa2.png",
    images: [
      "/Eco Spa2.png",
      "/Eco Spa1.png",
      "/eco spa3.png",
    ],
  },
  {
    id: "p18",
    category: "Household",
    title: "Inflatable Hot Tub",
    ticketPrice: 4,
    marketPrice: 300,
    description: `Bestway SaluSpa Hawaii AirJet Inflatable Hot Tub (Square, Navy Blue)\n\n• Capacity & Dimensions\nSeating Capacity: 4 to 6 Adults\nExterior Dimensions: 71" L × 71" W × 28" H (180 cm × 180 cm × 71 cm)\nInterior Width: ~51 inches (130 cm)\nWater Capacity (80% full): 222 Gallons (840 Liters)\nNet/Unfilled Weight: ~96.5 lbs (43.8 kg)\nFilled Weight: ~1,938 lbs (879 kg)\n\n• Heating & Jet System\nMassage Jets: 140 AirJet™ bubbling massage system along the bottom perimeter\nMaximum Heating Temperature: 104°F (40°C)\nHeating System Speed: Approx. 2°F – 3°F per hour (1.0°C – 1.5°C/hr)\nWater Flow Rate: 320 gal/hr (1,211 L/hr)\n\n• Construction & Features\nMaterial: 3-layer DuraPlus™ / TriTech™ puncture-resistant PVC wall construction with Y-beam internal support\nFreeze Shield™: Automatic heating function turns on when ambient temps drop below 42°F (6°C) to prevent water freezing and pump damage\nControl Panel: Flip-up digital control panel accessible from inside the tub\nIncluded Accessories: Reinforced clip-on thermal cover, multi-function pump with integrated filtration, ChemConnect™ chemical dispenser, and Vi-type filter cartridge.\nPower Supply: 110–120V AC, 60Hz, 12A (standard household 15A or 20A outlet)\nHeater Rating: 1,350W @ 120V\nMassage Tube/Blower Power: 800W`,
    image: "/Inflatable hot tub.png",
    images: [
      "/Inflatable hot tub.png",
    ],
  },
  {
    id: "p19",
    category: "Household",
    title: "Snoo Happiest Baby Bassinet",
    ticketPrice: 6,
    marketPrice: 250,
    description: `• Core Functionality & Soothing\nMotion & Sound Levels: 5 distinct levels of specially designed sound (white noise) and gentle rocking motion\nResponsiveness: Advanced algorithm and microphones distinguish infant crying from background ambient noise to automatically scale soothing levels\nSafety Mechanism: Built-in safety clips require the proprietary SNOO Sleep Sack wings to be attached before the motor activates (prevents rolling)\n\n• Dimensions & Weight\nAssembled Dimensions: 35.75" L × 19" W × 31" H (90.8 cm × 48.3 cm × 78.7 cm)\nAssembled Weight: 38 lbs (17.2 kg)\n\n• Connectivity & Electronics\nWi-Fi Connectivity: 802.11b/g/n @ 2.4GHz\nApp Control: iOS and Android compatible (features remote control, customizable motion/sound limits, weaning mode, and daily sleep logs)\nRadiation Safeguard: Internal Wi-Fi shield to direct wireless radiation away from the infant\nPower Supply: 12\text{V} DC power adapter (100–240V universal wall input)\n\n• Construction & Materials\nMesh Outer Wall: 100\% breathable polyester mesh for max airflow and visibility\nBase Finish: Dark faux-wood trim with white metal hairpin legs\nMattress & Sheet: Polyurethane foam mattress with a water-resistant cover and 100% GOTS-certified organic cotton fitted sheet`,
    image: "/Snoo Baby.jpg",
    images: [
      "/Snoo Baby.jpg",
      "/Snoo Baby2.jpg",
      "/Snoo Baby3.jpg",
      "/Snoo Baby4.jpg",
    ],
  },
  {
    id: "p20",
    category: "Household",
    title: "Irest massage chair",
    ticketPrice: 6,
    marketPrice: 250,
    description: `iRest SL-Track Full Body Zero Gravity Massage Chair\n\n• Massage & Track System\nTrack Type: Ergonomic 53–55 in (135 cm) SL-Track (follows the natural S-curve of the spine from head down to the glutes/hamstrings)\nMassage Mechanism: 3D Quad-Roller Intelligent Mechanical Massage Hands (simulates human techniques: kneading, tapping, knocking, shiatsu, and flapping)\nAuto Body Scanning: Smart sensor auto-detects spine curves and shoulder height for custom roller alignment\nAuto Programs: 8+ pre-programmed automatic massage routines\nManual Adjustments: 3 roller width levels, 3-level intensity adjustment, and speed controls\n\n• Comfort & Features\nZero Gravity: 3-stage Zero-Gravity reclining angles (aligns knees and heart to relieve spinal compression)\nAir Compression: Full-body airbag compression system (shoulders, arms, hips, calves, and feet)\nHeat Therapy: Carbon fiber lumbar/lower back heating (~122°F / 50°C)\nAudio System: Integrated Bluetooth stereo speakers built into the headrest\nFoot & Calf Massage: Under-foot reflexology rollers with surrounding calf compression airbags\n\n• Frame & Dimensions\nUpholstery: Premium wear-resistant, easy-clean PU Faux Leather\nAssembled Dimensions (Upright): ~60" L × 30" W × 45" H (152 cm × 76 cm × 114 cm)\nWeight Capacity: Up to 300 lbs (136 kg)\nChair Weight: ~183 lbs / 83 kg (Net)\nPower & Noise: 120W | Operating noise level ≤ 50 dB\n\nRecline Clearance Needed: Forward-sliding base design (requires ~10 in / 25 cm clearance from the wall)`,
    image: "/Massage sit.png",
    images: [
      "/Massage sit.png",
      "/massage sit1.png",
    ],
  },
];

/**
 * Catalog Component
 * - Displays categories (Electronics, Phones, Laptops, Furniture, Household)
 * - Smaller product cards
 * - Category filter + search bar
 * - Real images (local PNG/JPG + online placeholders)
 */
export default function Catalog({ openProduct }) {
  // ----- CATEGORY LIST -----
  const categories = ["All", "Casual & Outdoor Wear", "Sports", "Electronics", "Furniture", "Household"];

  // ----- STATE -----
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  // ----- FILTER LOGIC -----
  const filtered = catalogItems.filter((item) => {
    const matchCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  return (
    <div
      className="max-w-6xl mx-auto p-6"
      style={{ backgroundColor: "#f1f5f9" }}
    >
      <h1
        className="text-xl font-bold mb-4"
        style={{ fontSize: "1.25rem" }}
      >
        Product Catalog
      </h1>

      {/* ----- SEARCH INPUT (full width) ----- */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search products..."
          className="p-2 border rounded w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ----- CATEGORY BUTTONS - Grid with 6 equal columns, full width, evenly distributed ----- */}
      <div className="grid grid-cols-6 gap-2 w-full mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2 py-1 rounded border text-center text-sm ${
              selectedCategory === cat
                ? "bg-sky-600 text-white"
                : "bg-white text-slate-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ----- PRODUCT GRID - Exactly two cards per row, edge to edge ----- */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
          width: '100%'
        }}
      >
        {filtered.map((item) => (
          <div
            key={item.id}
            className="cursor-pointer hover:shadow-lg transition"
            style={{
              width: '100%',
              backgroundColor: '#e6f3ff',
              borderRadius: '0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              overflow: 'hidden',
              padding: '16px',
              paddingBottom: '20px',
              marginBottom: '10px'
            }}
            onClick={() => openProduct(item)}
          >
            {/* White container for title + category + price with 20px left/right margins */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '0px',
                padding: '10px',
                marginLeft: '10px',
                marginRight: '10px',
                marginTop: '10px',
                marginBottom: '20px'
              }}
            >
              <div style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '8px', color: '#1e293b' }}>{item.title}</div>
              <div style={{ fontSize: '0.875rem', color: '#475569' }}>{item.category}</div>
              <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#334155', marginTop: '8px' }}>
                $ {item.ticketPrice} <span style={{ fontSize: '0.75rem' }}>/ticket</span>
              </div>
            </div>
            {/* White container for image with 10px margins and padding */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '0px',
                marginLeft: '5px',
                marginRight: '5px',
                marginTop: '10px',
                marginBottom: '10px',
                padding: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ maxWidth: '100%', height: 'auto', objectFit: 'contain', borderRadius: '6px' }}
                  onError={(e) =>
                    (e.target.src = "https://via.placeholder.com/200x150")
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
