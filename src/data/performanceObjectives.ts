export type PerformanceObjective = {
  id: string;
  title: string;
  page: string;
};

export type PerformanceSection = {
  id: string;
  title: string;
  objectives: PerformanceObjective[];
};

// Source: 25-26 PO's document (TOC extraction).

// Note: The section starting at page 48 is inferred as "Hose" based on objective titles.

export const PERFORMANCE_SECTIONS: PerformanceSection[] = [
  {
    id: "intro",
    title: "Introduction",
    objectives: [
      { id: "intro-2-preface", title: "Preface", page: "2" },
      { id: "intro-3-5-procedure", title: "Procedure", page: "3-5" },
    ],
  },
  {
    id: "ppe",
    title: "PPE",
    objectives: [
      { id: "ppe-7-donning", title: "Donning", page: "7" },
      { id: "ppe-8-inspect-scba", title: "Inspect SCBA", page: "8" },
      { id: "ppe-9-don-scba-over-the-head-method", title: "Don SCBA “over the head” method", page: "9" },
      { id: "ppe-10-don-scba-coat-method", title: "Don SCBA “coat” method", page: "10" },
      { id: "ppe-11-don-scba-seat-mounted-method", title: "Don SCBA “seat mounted” method", page: "11" },
      { id: "ppe-12-don-facemask-chin-first-method", title: "Don Facemask “chin first” method", page: "12" },
      { id: "ppe-13-don-facemask-ball-cap-method", title: "Don Facemask “ball cap” method", page: "13" },
      { id: "ppe-14-doff-facemask", title: "Doff Facemask", page: "14" },
      { id: "ppe-15-change-air-cylinder", title: "Change air cylinder", page: "15" },
    ],
  },
  {
    id: "ropes-knots",
    title: "Ropes & Knots",
    objectives: [
      { id: "ropes-knots-17-introduction", title: "Introduction", page: "17" },
      { id: "ropes-knots-18-overhand-safety", title: "Overhand Safety", page: "18" },
      { id: "ropes-knots-19-clove-hitch-in-hand", title: "Clove Hitch in hand", page: "19" },
      { id: "ropes-knots-20-clove-hitch-around-an-object", title: "Clove Hitch around an object", page: "20" },
      { id: "ropes-knots-21-clove-hitch-on-a-bight-around-an-object", title: "Clove Hitch on a bight around an object", page: "21" },
      { id: "ropes-knots-22-becket-bend-or-sheet-bend", title: "Becket Bend or Sheet Bend", page: "22" },
      { id: "ropes-knots-23-bowline", title: "Bowline", page: "23" },
      { id: "ropes-knots-24-bowline-around-an-object", title: "Bowline around an object", page: "24" },
      { id: "ropes-knots-25-figure-eight-stopper", title: "Figure Eight Stopper", page: "25" },
      { id: "ropes-knots-26-figure-eight-on-a-bight", title: "Figure Eight on a Bight", page: "26" },
      { id: "ropes-knots-27-figure-eight-follow-through-or-around-an-object", title: "Figure Eight follow through or around an object", page: "27" },
      { id: "ropes-knots-28-figure-eight-bend-revised-2018", title: "Figure Eight Bend (Revised 2018)", page: "28" },
      { id: "ropes-knots-29-tag-line-revised-2018", title: "Tag Line (Revised 2018)", page: "29" },
      { id: "ropes-knots-30-ladder", title: "Ladder", page: "30" },
      { id: "ropes-knots-31-tools-with-an-enclosed-handle", title: "Tools with an enclosed handle", page: "31" },
      { id: "ropes-knots-32-pick-head-or-fire-axe", title: "Pick Head or Fire Axe", page: "32" },
      { id: "ropes-knots-33-pike-pole", title: "Pike Pole", page: "33" },
      { id: "ropes-knots-34-uncharged-hose-line", title: "Uncharged hose line", page: "34" },
    ],
  },
  {
    id: "ground-ladders",
    title: "Ground Ladders",
    objectives: [
      { id: "ground-ladders-36-introduction", title: "Introduction", page: "36" },
      { id: "ground-ladders-37-38-deploy-a-24-extension-ladder", title: "Deploy a 24’ extension ladder", page: "37-38" },
      { id: "ground-ladders-39-climb-a-ladder", title: "Climb a ladder", page: "39" },
      { id: "ground-ladders-40-leg-lock-on-a-ladder", title: "Leg lock on a ladder", page: "40" },
      { id: "ground-ladders-41-lock-on-a-ladder-with-a-harness", title: "Lock on a ladder with a harness", page: "41" },
      { id: "ground-ladders-42-climb-a-ladder-carrying-a-tool", title: "Climb a ladder carrying a tool", page: "42" },
      { id: "ground-ladders-43-climb-a-ladder-with-an-uncharged-hose-line", title: "Climb a ladder with an uncharged hose line", page: "43" },
    ],
  },
  {
    id: "hose",
    title: "Hose",
    objectives: [
      { id: "hose-48-introduction", title: "Introduction", page: "48" },
      { id: "hose-49-coupling-hose-foot-tilt", title: "Coupling Hose; Foot Tilt", page: "49" },
      { id: "hose-50-uncoupling-hose-knee-press", title: "Uncoupling Hose; Knee Press", page: "50" },
      { id: "hose-51-flat-load", title: "Flat Load", page: "51" },
      { id: "hose-52-accordion-load", title: "Accordion Load", page: "52" },
      { id: "hose-53-hydrant-connection", title: "Hydrant Connection", page: "53" },
      { id: "hose-54-apply-hose-clamp", title: "Apply Hose Clamp", page: "54" },
      { id: "hose-55-forward-hose-lay", title: "Forward Hose Lay", page: "55" },
      { id: "hose-56-reverse-hose-lay", title: "Reverse Hose Lay", page: "56" },
      { id: "hose-57-shoulder-load-from-a-flat-hose-load", title: "Shoulder Load from a Flat Hose Load", page: "57" },
      { id: "hose-58-pre-connect-flat-load", title: "Pre-connect Flat Load", page: "58" },
      { id: "hose-59-deploy-pre-connect-flat-load", title: "Deploy Pre-connect Flat Load", page: "59" },
      { id: "hose-60-pre-connect-minuteman-load", title: "Pre-connect Minuteman Load", page: "60" },
      { id: "hose-61-deploy-pre-connect-minuteman-load", title: "Deploy Pre-connect Minuteman Load", page: "61" },
      { id: "hose-62-pre-connect-triple-layer-load", title: "Pre-connect Triple Layer Load", page: "62" },
      { id: "hose-63-deploy-pre-connect-triple-layer-load", title: "Deploy Pre-connect Triple Layer Load", page: "63" },
      { id: "hose-64-advance-hose-up-a-ladder", title: "Advance Hose up a Ladder", page: "64" },
      { id: "hose-65-interior-standpipe-connection-advance-hose-up-a-stairway", title: "Interior Standpipe Connection / Advance Hose up a Stairway", page: "65" },
      { id: "hose-66-replace-a-burst-section", title: "Replace a Burst Section", page: "66" },
      { id: "hose-67-extend-a-hose-line-same-diameter", title: "Extend a Hose Line; Same Diameter", page: "67" },
      { id: "hose-68-extend-a-hose-line-smaller-diameter", title: "Extend a Hose Line; Smaller Diameter", page: "68" },
      { id: "hose-69-large-handline-exposure-loop-keli-coil", title: "Large Handline Exposure Loop (Keli-Coil)", page: "69" },
      { id: "hose-70-supply-an-fdc", title: "Supply an FDC", page: "70" },
      { id: "hose-71-establish-deploy-a-foam-line", title: "Establish / Deploy a Foam Line", page: "71" },
      { id: "hose-72-establish-deploy-a-courtyard-lay-revised-2018", title: "Establish / Deploy a Courtyard Lay (Revised 2018)", page: "72" },
      { id: "hose-73-establish-deploy-a-master-stream-device-ground-monitor", title: "Establish / Deploy a Master Stream Device; Ground Monitor", page: "73" },
      { id: "hose-74-straight-storage-roll-revised-2018", title: "Straight/Storage Roll (Revised 2018)", page: "74" },
      { id: "hose-75-donut-roll", title: "Donut Roll", page: "75" },
      { id: "hose-76-twin-donut-roll", title: "Twin Donut Roll", page: "76" },
      { id: "hose-77-damaged-roll", title: "Damaged Roll", page: "77" },
      { id: "hose-78-supply-hose-and-appliances", title: "Supply Hose and Appliances", page: "78" },
    ],
  },
  {
    id: "forcible-entry",
    title: "Forcible Entry",
    objectives: [
      { id: "forcible-entry-80-introduction", title: "Introduction", page: "80" },
      { id: "forcible-entry-81-outward-swinging-doors", title: "Outward Swinging Doors", page: "81" },
      { id: "forcible-entry-82-inward-swinging-doors", title: "Inward Swinging Doors", page: "82" },
      { id: "forcible-entry-83-inward-swinging-doors-wood-frame", title: "Inward Swinging Doors; Wood Frame", page: "83" },
      { id: "forcible-entry-84-double-swinging-doors", title: "Double Swinging Doors", page: "84" },
      { id: "forcible-entry-85-tempered-plate-glass-doors", title: "Tempered Plate Glass Doors", page: "85" },
      { id: "forcible-entry-86-sliding-doors", title: "Sliding Doors", page: "86" },
      { id: "forcible-entry-87-overhead-sectional-doors", title: "Overhead Sectional Doors", page: "87" },
      { id: "forcible-entry-88-overhead-rolling-steel-doors", title: "Overhead Rolling Steel Doors", page: "88" },
      { id: "forcible-entry-89-through-the-lock-method-k-tool", title: "Through the Lock method; K-Tool", page: "89" },
      { id: "forcible-entry-90-through-the-lock-method-a-tool", title: "Through the Lock method; A-Tool", page: "90" },
      { id: "forcible-entry-91-fixed-glass-panel-regular-plate", title: "Fixed Glass Panel; Regular Plate", page: "91" },
      { id: "forcible-entry-92-fixed-glass-panel-tempered-plate", title: "Fixed Glass Panel; Tempered Plate", page: "92" },
      { id: "forcible-entry-93-checkrail-windows-wood-frame", title: "Checkrail Windows; Wood Frame", page: "93" },
      { id: "forcible-entry-94-checkrail-windows-metal-frame", title: "Checkrail Windows; Metal Frame", page: "94" },
      { id: "forcible-entry-95-casement-windows", title: "Casement Windows", page: "95" },
      { id: "forcible-entry-96-awning-windows", title: "Awning Windows", page: "96" },
      { id: "forcible-entry-97-jalousie-windows", title: "Jalousie Windows", page: "97" },
      { id: "forcible-entry-98-hurricane-windows", title: "Hurricane Windows", page: "98" },
    ],
  },
  {
    id: "ventilation",
    title: "Ventilation",
    objectives: [
      { id: "ventilation-100-introduction", title: "Introduction", page: "100" },
      { id: "ventilation-101-horizontal", title: "Horizontal", page: "101" },
      { id: "ventilation-102-hydraulic", title: "Hydraulic", page: "102" },
      { id: "ventilation-103-positive-pressure", title: "Positive Pressure", page: "103" },
      { id: "ventilation-104-negative-pressure", title: "Negative Pressure", page: "104" },
      { id: "ventilation-105-106-vertical-pitched-roof-revised-2018", title: "Vertical; Pitched Roof (Revised 2018)", page: "105-106" },
      { id: "ventilation-107-108-vertical-flat-roof-revised-2018", title: "Vertical; Flat Roof (Revised 2018)", page: "107-108" },
    ],
  },
  {
    id: "salvage-overhaul",
    title: "Salvage & Overhaul",
    objectives: [
      { id: "salvage-overhaul-111-opening-a-ceiling", title: "Opening a Ceiling", page: "111" },
      { id: "salvage-overhaul-112-opening-a-wall", title: "Opening a Wall", page: "112" },
      { id: "salvage-overhaul-113-preserve-protect-evidence", title: "Preserve / Protect Evidence", page: "113" },
      { id: "salvage-overhaul-114-water-chute", title: "Water Chute", page: "114" },
      { id: "salvage-overhaul-115-water-catchall", title: "Water Catchall", page: "115" },
      { id: "salvage-overhaul-116-salvage-cover-roll", title: "Salvage Cover Roll", page: "116" },
      { id: "salvage-overhaul-117-salvage-cover-fold", title: "Salvage Cover Fold", page: "117" },
      { id: "salvage-overhaul-118-deploy-a-salvage-cover-roll", title: "Deploy a Salvage Cover Roll", page: "118" },
      { id: "salvage-overhaul-119-deploy-a-salvage-cover-fold", title: "Deploy a Salvage Cover Fold", page: "119" },
      { id: "salvage-overhaul-120-stop-water-flow-from-a-sprinkler-head", title: "Stop Water Flow from a Sprinkler Head", page: "120" },
    ],
  },
  {
    id: "miscellaneous",
    title: "Miscellaneous",
    objectives: [
      { id: "miscellaneous-122-introduction", title: "Introduction", page: "122" },
      { id: "miscellaneous-123-fire-extinguishers", title: "Fire Extinguishers", page: "123" },
      { id: "miscellaneous-124-confined-space", title: "Confined Space", page: "124" },
      { id: "miscellaneous-125-sprinkler-systems", title: "Sprinkler Systems", page: "125" },
    ],
  },
  {
    id: "big-2-skills",
    title: "Big 2 & Skills",
    objectives: [
      { id: "big-2-skills-127-129-introduction", title: "Introduction", page: "127-129" },
      { id: "big-2-skills-130-131-ppe-scba-hose-revised-2018", title: "PPE, SCBA, Hose (Revised 2018)", page: "130-131" },
      { id: "big-2-skills-132-134-ladder-search-rescue-revised-2018", title: "Ladder, Search & Rescue (Revised 2018)", page: "132-134" },
      { id: "big-2-skills-1001-job-performance-requirements-nfpa", title: "Job Performance Requirements NFPA", page: "1001" },
    ],
  },
];
