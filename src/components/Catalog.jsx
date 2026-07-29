import React, { useState } from "react";

// ----- EXPORTED PRODUCT DATA (used by App.jsx for URL resolution) -----
export const catalogItems = [
  // ----- Casual & Outdoor Wear -----
  {
    id: "p1",
    category: "Casual & Outdoor Wear",
    title: "Balaclava",
    ticketPrice: 3,
    marketPrice: 65,
    description: "Tactical Lightweight Hinged Balaclava\n\n◆ Material & Fabric Construction\n• Material Composition: 95% High-Density Polyester / 5% Spandex\n• Fabric Weight: Ultra-lightweight (~40g to 45g)\n• Properties: Moisture-wicking, quick-drying, breathable, and anti-static\n\n◆ Operational Features & Compatibility\n• Protection: Blocks dust, wind, mild cold, and harmful UV rays\n• Anti-Fogging: Breathable mesh structure helps disperse warm breath to reduce goggle/eyewear fogging\n• Helmet Compatibility: Designed as a low-drag inner layer for tactical helmets (FAST/MICH), motorcycle helmets, or bicycle helmets\n​• Full Face Balaclava (Head, neck, and face coverage)",
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
    description: "◆ General & Dimensions\n• Model: Club Car DS (2-Passenger)\n• Overall Length: 91.5 inches (232 cm)\n• Overall Width: 48.75 inches (123.8 cm)\n• Overall Height (with canopy): 69.0 – 71.0 inches (175–180 cm)\n• Vehicle Load Capacity: 500 lbs (226kg)\n\n◆ Chassis & Body\n• Frame: AlumiCore™ lightweight, rustproof ladder-style aluminum box beam frame\n• Body Finish: ArmorFlex® injection-molded composite with UV protection\n​• Front Suspension: Independent leaf spring with dual hydraulic shocks\n• Rear Suspension: Leaf spring with dual hydraulic shocks\n• Steering: SportDrive™ self-compensating double-reduction helical rack & pinion\n• Brakes: Rear-wheel mechanical drum brakes with foot-actuated 3-position parking brake\n• Standard Tires: 18 × 8.50 – 8 (4-ply rated)\n\n◆ Powertrain\n• Motor: 3.3 HP to 3.7 HP DC electric motor\n• Power system: 48-Volt PowerDrive\n• Batteries: four 12V batteries (48V system)\n• Curb Weight: ~910 lbs – 975 lbs (including lead-acid batteries)\n• Top Speed: 12 – 15 mph (Standard)",
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
    description: "◆ Display & Optics\n• Display Type: Dual 2.89-inch LCD panels (RGB stripe subpixels\n• Resolution: 2160 \times 2160 pixels per eye (4320 \times 2160 combined)\n• Refresh Rate: 90 Hz\n• Field of View (FOV): 114° diagonal (~95° horizontal)\n• Lenses: Dual Fresnel lenses\n• Interpupillary Distance (IPD): Fixed hardware at 63 mm (software-adjustable IPD offset)\n\n◆ Tracking & Sensors\n• Tracking Type: 6 Degrees of Freedom (6 DoF) Inside-Out Tracking\n• Cameras: 2 Front-facing visible spectrum cameras\n• Sensors: Integrated gyroscope, accelerometer, and magnetometer\n\n◆ Audio & Connectivity\n• Audio System: Integrated spatial audio with removable headphones\n• Microphone: Dual integrated noise-canceling smart assistant microphones\n• Cable Connection: 2-in-1 cable with DisplayPort 1.3 and USB 3.0\n\n◆ Controllers (WMR 1st-Gen)\n• Tracking: 6 DoF tracked via LED constellation rings\n• Connectivity: Bluetooth 4.0 (pre-synced to the headset)\n• Power Source: 2× AA batteries per controller",
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
    description: "◆ Engine & Performance\n• Engine Type: 1052cc, 4-Stroke, 4-Cylinder, DOHC (20 Valves) Yamaha MR-1 Marine Engine\n• Horsepower: ~102 HP @ 8,000 RPM\n• Compression Ratio: 11.4:1\n• Induction / Fuel System: Electronic Fuel Injection (EFI)\n• Cooling System: Open-loop, water-cooled\n• Top Speed: ~52 – 54 mph\n\n◆ Drive Unit & Propulsion\n• Pump Type: 155 mm Axial Flow, Single-Stage\n• Impeller: 3-Blade Stainless Steel\n• Reverse System: Manual Reverse Bucket with Left-Side Lever\n• Steering Assist: Yamaha Off-Throttle Steering (OTS)\n\n◆ Dimensions & Capacities\n• Overall Length: 126.8 inches (3,220 mm)\n• Overall Width: 46.1 inches (1,170 mm)\n• Overall Height: 45.3 inches (1,150 mm)\n​• Dry Weight: 716 lbs (325 kg)\n• Rider Capacity: 1–3 Persons (Max Weight: 530 lbs / 240 kg)\n• Fuel Tank Capacity: 15.9 Gallons (60 Liters)\n• Total Storage Capacity: 17.8 Gallons / 67.4 Liters (Front Bow Storage + Glovebox)\n• Instrumentation: Digital Multi-Function Display (Speedometer, Tachometer, Fuel Level, Hour Meter)",
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
    description: "◆ Camera & Imaging\n• Primary Front Camera - 1080P HD\n• Bottom Camera - Basic optical flow secondary camera\n• Transmission - 2.4GHz Wi-Fi FPV feed directly to a smartphone app up to ~80 meters away\n\n◆ Battery Capacity & Power\n• Battery Type - Modular, plug-in 3.7V Lithium Battery\n• Capacity - 1200mAh\n• Charging time - Approximately 90min\n\n◆ Propellers & Motors\n• Propellers - Lightweight, flexible 2-blade plastic propellers\n• Protective Guards - Comes with 4 snap-on propeller guard frames to prevent blade damage during indoor crashes\n\n◆ Flexibility, Flight Modes & Controls\n• Foldability - Highly compact & foldable\n• 360° Stunt Flips - Dedicated button to perform automatic aerial flips\n• Optical Flow & Altitude Hold - Automatically hovers in place using its bottom camera sensor\n• Gesture Control - Take photos/videos using hand gestures (peace sign / open palm)\n• Trajectory Flight - Draw a line on the smartphone screen for the drone to follow\n• Comes with instruction manual and accessories\n• The V15 mini drone captures great in-flight pictures and videos.\n\n• Perfect working condition.",
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
    description: `Wavestorm 8ft Classic Soft-Top Surfboards\n\n◆ Dimensions & Capacities\n• Length: 8 ft (96 in / 243.8 cm)\n• Width: 22.5 in (57.1 cm)\n• Thickness: 3.25 in (8.25 cm)\n• Volume: 86 Liters\n• Board Weight: ~11.5 lbs (5.2 kg)\n\n◆ Core Construction & Materials\n• Core: High-density EPS (Expanded Polystyrene) foam core\n• Stringer System: 3× Marine-ply wood stringers (provides rigidity and flex control)\n• Decking Skin: Soft WBS-IXL (Water Barrier Skin) cross-linked foam deck with UV-inhibiting graphics\n• Bottom Slick: High-Density Polyethylene (HDPE) high-speed slick bottom skin\n\n◆ Hardware & Accessories Included\n• Fin Setup: Thruster setup (3× 4.5" bolt-through removable fins)\n• Traction Pad: Textured EVA tail traction pad pre-installed\n• Leash: Removable polyurethane ankle leash with pre-installed leash plug`,
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
    description: `◆ Motor & Drive System\n• Motor: 2.6 CHP (Continuous Horsepower) Mach Z™ / Quiet Drive Motor\n• Speed Range: 0 – 10 MPH (0 – 16 km/h) with QuickSpeed® digital control buttons\n• Incline Range: 0% – 10% Powered Incline with QuickIncline® controls\n\n◆ Running Deck & Cushioning\n• Running Surface / Belt Size: 20" W × 55" L (46 cm × 140 cm)\n• Cushioning: ProShox™ Deck Cushioning (absorbs landing impact)\n• Rollers: 1.9" Precision-Balanced Non-Flex Rollers\n\n◆ Display, Audio & Connectivity\n• Display: 5-inch High-Contrast Backlit LCD Display\n• App Integration: iFIT Enabled (Bluetooth sync for trainer-led auto-adjusting workouts)\n• Audio: Dual 2-inch Bluetooth speakers\n• Heart Rate: Bluetooth Smart HR Monitor compatible (no pulse grips on console)\n• Convenience Extras: Integrated tablet/device ledge, dual water bottle holders\n\n◆ Frame & Dimensions\n• Design: SpaceSaver® Folding Design with EasyLift™ Assist hydraulic release mechanism\n• Assembled Footprint: 65" L × 35" W × 64" H (165 cm × 89 cm × 163 cm)\n• Maximum User Capacity: 300 lbs (136 kg)\n• Product Weight: ~186 lbs (84 kg)\n• More models available.`,
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
    description: `◆ Motor & Electronics\n• Motor: 350W Rear Hub Motor (Peak Power: 600W / 45+ Nm Torque)\n• Battery: 36V 14.7Ah LG Lithium-Ion (IPX7 Waterproof rating)\n• Top Speed: Up to 20 MPH (Throttle) / 25–28 MPH (Pedal Assist)\n• Estimated Range: 40 – 50 miles per charge\n• Pedal Assist / Drive: Cadence Sensor with 5 PAS Levels + Thumb Throttle\n• Charger: 36V 2.0A Smart Charger\n\n◆ Drivetrain, Suspension & Brakes\n• Gearing: Shimano 7-Speed Derailleur & Shifter\n• Crankset: Aluminum Alloy, 170 mm, 44T Chainring\n• Brakes: ZOOM Mechanical Dual-Pull Disc Brakes\n• Front Fork: 100 mm Suspension Fork\n• Tires: 27.5" × 2.4" City / Urban All-Terrain Tires\n\n◆ Frame & Dimensions\n• Frame Material: 6061 Aluminum Alloy Step-Thru Frame\n• Max Payload Capacity: 350 lbs (158 kg)\n• Rider Height Compatibility: 5'2" to 6'4"\n• Accessories Included: Front headlight, rear integrated brake light, front cargo basket with wooden base, rear rack with trunk bag, full-coverage fenders, and side mirrors.`,
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
    description: `◆ Optics & Sensor\n• Sensor Type & Resolution: 1920 \times 1080 CMOS Sensor\n• Display Type & Resolution: 1280 \times 720 FLCOS Display\n• Optical Magnification: 4x\n• Digital Zoom: 1x - 8x (total magnification up to 32x)\n• Field of View: 21 ft @ 100 yards (7m @ 100 m)\n• Diopter Adjustment: -6 to +3\n\n◆ IR Illuminator & Night Range\n​• IR Wavelength: 850 nm (Removable IR Flashlight included)\n• Night Vision Detection Range: Up to 200 yards (183 meters)\n• IR Battery Type: 2× CR123A batteries\n\n◆ Video & Recording\n• Video Recording Resolution: 1080p HD / 720p HD (AVI format)\n• Photo Resolution: JPEG format\n• Storage Support: MicroSD card slot (supports up to 64GB)\n• Output Port: Micro-USB port for video export and external power\n\n◆ Power & Construction\n• Power Supply (Scope): 4× AA batteries\n• Battery Life (Scope): ~3.5 hours (recording mode) / ~4.5 hours (preview mode)\n• Water Resistance Rating: IP55 (water-resistant)\n• Dimensions (L × W × H): 10.5" × 1.875" × 3.0" (266 mm × 63 mm × 75 mm)\n• Weight: 36.3 oz / 1030 g (including batteries)`,
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
    description: "• 2 Swivel rocking outdoors chairs, fire pit, and 5 pc sectional.\nBrand is Beachcroft.",
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
    description: "• Kitchen Island.Excellent condition no damages.\n• Dimensions 1.5m long, 1m wide and 1m high.",
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
    description: "• Elevate your outdoor space with this exquisite Brand Broyhill patio set. Perfect for entertaining, this set comfortably seats 7 and includes a table plus two extra seats, expanding to accommodate up to 9 people. \n\n• It's used only once, it looks like new. \n• Free of parties, kids and pets.",
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
    description: "• Light Grey weave fabric with piping on edge.It can give a hint of beige with the wood trim.Bought at The Brick, special ordered as colour not shown in store.The legs and bottom is wood trim in a medium to dark stain. \n• This sectional is very heavy and good quality. The extra seat can be attached to make one side longer or used as extra seat like here.\n• 95”x 95” width and XSeat is 24”width, and all seating 34” in depth (Back to front),\nheight is 34” floor to top of cushion. \n• There is no marks nicks or stains.No pets, no kids, non smoking very clean home! It never gets sat on only when company comes for seasonal holidays!",
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
    description: "• Beautiful Sofa set with power recliners and USB charging ports. \n• Sofas are bonded leather white color fabric. Sofas include easily removable backrests which makes it ideal for transporting and maneuvering around into tight spaces. \n• Sofas are just 6 months old, adult used and considered to be in mint condition.\n• Sofa is 85 inches long and Loveseat is 63 inches long.",
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
    description: `• Comfy 3-seater with reversible storage ottoman\n• 78" D x 53" W x 32" H (seat depth 21", seat height 18.5")\n• Cold beige linen (light gray-ish), sturdy iron frame, soft cushions.\n• Modern, sleek, and super functional.\n• No pets, no smoking home.`,
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
    description: `LG WM3570HVA Front-Load Washer\n\n◆ Capacity & Dimensions}\n• Capacity: 4.3 cu. ft. Ultra Large Capacity\n• Dimensions (W × H × D): 27" × 38 11/16" × 29 3/4" (51" Depth with door open)
Weight: 192 lbs\n• Weight: 192 lbs\n\n◆ Performance & Features\n• Motor Type: Inverter Direct Drive Motor (10-Year Limited Warranty)\n​• Max Spin Speed: 1,300 RPM\n• Technologies: TurboWash® (saves up to 20 mins per load), 6Motion™ Technology, TrueBalance™ Anti-Vibration\nSteam Options: TrueSteam™, AAFA Certified Allergiene™ Cycle, NSF Certified Sanitary Cycle\n• Wash Programs (12): Cotton/Normal, Bulky/Large, Perm Press, Delicates, Speed Wash, Sanitary, Heavy Duty, BrightWhites™, Towels, Allergiene™, Tub Clean, Downloaded Cycle\n• Energy Rating: ENERGY STAR® Most Efficient\n\nLG DLEX3570V / DLGX3571V Dryer\n\n◆ Capacity & Dimensions\n• Capacity: 7.4 cu. ft. Ultra Capacity\n• Dimensions (W × H × D): 27" × 38 11/16" × 29 3/4" (51" Depth with door open)\n• Weight: 136 lbs\n\n◆ Performance & Features\n• Drying System: Sensor Dry System with Precise Temperature Control\n• Steam Features: TrueSteam™, SteamFresh™ Cycle (20-min refresh for up to 5 garments), SteamSanitary™ Cycle\n• Drying Programs (12): SteamFresh™, SteamSanitary™, Heavy Duty, Regular/Normal, Bulky/Large, Towels, Perm Press, Delicates, Small Load, Antibacterial, Speed Dry, Air Dry\n• Drum Material: Aluminized Alloy Steel Drum (Alcosta) with Interior Light\n• Power Requirements: 240V / 30A (Electric model DLEX3570V) or 120V / 15A (Gas model DLGX3571V)`,
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
    description: `◆ Shell & Seating\n• Seating Capacity: 4 – 6 Person (open bucket seating with dual cushioned headrests)\n• Dimensions: 76.5" L × 76.5" W × 35" H (194 cm × 194 cm × 89 cm)\n• Water Capacity: 280 – 310 Gallons (1,060 – 1,173 Liters)\n• Dry Weight: ~510 – 595 lbs (231 – 270 kg)\n• Construction: Rotationally molded (rotomolded) indestructible resin shell and cabinet\n\n◆ ​Jet & Pump System\n​• Total Jets: 31 Stainless Steel / LPI Directional and Massaging Jets\n• Pumps: Dual Pump System (1× 2-Speed 10A EE Pump + 1× 1-Speed 3A Auxiliary Pump)\n• Filtration: 50 sq. ft. screw-in filter\n• Features: Built-in 8" Backlit Waterfall, Air Control valves, and Ozone system\n\n◆ Electrical & Heating\n• Electrical Configuration: 110V Convertible (Plug & Play ready)\n• Supply Voltage: 115V / 20A dedicated plug (includes 15A GFCI power cord) or 230V / 50A hardwire\n• Heater: 1.0 kW @ 110V (Balboa Control System)\n• Lighting: Multi-color LED lighting package (underwater light, perimeter lights, and illuminated waterfall)\n• Insulation: Full foam / Blue sTUFF Denim thermal foil insulation`,
    image: "/Eco Spa2.png",
    images: [
      "/Eco Spa2.png",
      "/Eco Spa1.png",
      "/Eco Spa.png",
    ],
  },
  {
    id: "p18",
    category: "Household",
    title: "Inflatable Hot Tub",
    ticketPrice: 4,
    marketPrice: 300,
    description: `• Bestway SaluSpa Hawaii AirJet Inflatable Hot Tub (Square, Navy Blue)\n\n◆ Capacity & Dimensions\n• Seating Capacity: 4 to 6 Adults\n• Exterior Dimensions: 71" L × 71" W × 28" H (180 cm × 180 cm × 71 cm)\n• Interior Width: ~51 inches (130 cm)\n• Water Capacity (80% full): 222 Gallons (840 Liters)\n• Net/Unfilled Weight: ~96.5 lbs (43.8 kg)\n• Filled Weight: ~1,938 lbs (879 kg)\n\n◆ Heating & Jet System\n• Massage Jets: 140 AirJet™ bubbling massage system along the bottom perimeter\n• Maximum Heating Temperature: 104°F (40°C)\n• Heating System Speed: Approx. 2°F – 3°F per hour (1.0°C – 1.5°C/hr)\n• Water Flow Rate: 320 gal/hr (1,211 L/hr)\n\n◆ Construction & Features\n• Material: 3-layer DuraPlus™ / TriTech™ puncture-resistant PVC wall construction with Y-beam internal support\n• Freeze Shield™: Automatic heating function turns on when ambient temps drop below 42°F (6°C) to prevent water freezing and pump damage\n• Control Panel: Flip-up digital control panel accessible from inside the tub\n• Included Accessories: Reinforced clip-on thermal cover, multi-function pump with integrated filtration, ChemConnect™ chemical dispenser, and Vi-type filter cartridge.\n• Power Supply: 110–120V AC, 60Hz, 12A (standard household 15A or 20A outlet)\n• Heater Rating: 1,350W @ 120V\n• Massage Tube/Blower Power: 800W`,
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
    description: `◆ Core Functionality & Soothing\n• Motion & Sound Levels: 5 distinct levels of specially designed sound (white noise) and gentle rocking motion\n• Responsiveness: Advanced algorithm and microphones distinguish infant crying from background ambient noise to automatically scale soothing levels\n• Safety Mechanism: Built-in safety clips require the proprietary SNOO Sleep Sack wings to be attached before the motor activates (prevents rolling)\n\n◆ Dimensions & Weight\n• Assembled Dimensions: 35.75" L × 19" W × 31" H (90.8 cm × 48.3 cm × 78.7 cm)\n• Assembled Weight: 38 lbs (17.2 kg)\n\n◆ Connectivity & Electronics\n• Wi-Fi Connectivity: 802.11b/g/n @ 2.4GHz\n• App Control: iOS and Android compatible (features remote control, customizable motion/sound limits, weaning mode, and daily sleep logs)\n• Radiation Safeguard: Internal Wi-Fi shield to direct wireless radiation away from the infant\n• Power Supply: 12V DC power adapter (100–240V universal wall input)\n\n◆ Construction & Materials\n• Mesh Outer Wall: 100% breathable polyester mesh for max airflow and visibility\n• Base Finish: Dark faux-wood trim with white metal hairpin legs\n• Mattress & Sheet: Polyurethane foam mattress with a water-resistant cover and 100% GOTS-certified organic cotton fitted sheet`,
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
    description: `iRest SL-Track Full Body Zero Gravity Massage Chair\n\n◆ Massage & Track System\n• Track Type: Ergonomic 53–55 in (135 cm) SL-Track (follows the natural S-curve of the spine from head down to the glutes/hamstrings)\n• Massage Mechanism: 3D Quad-Roller Intelligent Mechanical Massage Hands (simulates human techniques: kneading, tapping, knocking, shiatsu, and flapping)\n• Auto Body Scanning: Smart sensor auto-detects spine curves and shoulder height for custom roller alignment\nAuto Programs: 8+ pre-programmed automatic massage routines\n• Manual Adjustments: 3 roller width levels, 3-level intensity adjustment, and speed controls\n\n◆ Comfort & Features\n• Zero Gravity: 3-stage Zero-Gravity reclining angles (aligns knees and heart to relieve spinal compression)\n• Air Compression: Full-body airbag compression system (shoulders, arms, hips, calves, and feet)\n• Heat Therapy: Carbon fiber lumbar/lower back heating (~122°F / 50°C)\n• Audio System: Integrated Bluetooth stereo speakers built into the headrest\n• Foot & Calf Massage: Under-foot reflexology rollers with surrounding calf compression airbags\n\n◆ Frame & Dimensions\n• Upholstery: Premium wear-resistant, easy-clean PU Faux Leather\n• Assembled Dimensions (Upright): ~60" L × 30" W × 45" H (152 cm × 76 cm × 114 cm)\n• Weight Capacity: Up to 300 lbs (136 kg)\n• Chair Weight: ~183 lbs / 83 kg (Net)\n• Power & Noise: 120W | Operating noise level ≤ 50 dB\n\n• Recline Clearance Needed: Forward-sliding base design (requires ~10 in / 25 cm clearance from the wall)`,
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
