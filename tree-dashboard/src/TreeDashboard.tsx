import React, { useState } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { TreePine, MapPin, Leaf } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Leaflet icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Define Budapest district centers (approximate coordinates) and real streets
const districtDataList = [
  { name: "I. Ker.", center: [47.4979, 19.0399], streets: ["Batthyány utca", "Dísz tér", "Úri utca"] },
  { name: "II. Ker.", center: [47.5200, 19.0200], streets: ["Pasaréti út", "Hűvösvölgyi út", "Szépvölgyi út"] },
  { name: "III. Ker.", center: [47.5500, 19.0400], streets: ["Bécsi út", "Fő tér", "Lajos utca"] },
  { name: "IV. Ker.", center: [47.5600, 19.0800], streets: ["Árpád út", "Pozsonyi utca", "Attila utca"] },
  { name: "V. Ker.", center: [47.4950, 19.0550], streets: ["Váci utca", "Petőfi Sándor utca", "Apáczai Csere János utca"] },
  { name: "VI. Ker.", center: [47.5050, 19.0650], streets: ["Andrássy út", "Izabella utca", "Jókai tér"] },
  { name: "VII. Ker.", center: [47.5000, 19.0700], streets: ["Dohány utca", "Rákóczi út", "Kazinczy utca"] },
  { name: "VIII. Ker.", center: [47.4850, 19.0800], streets: ["József körút", "Baross utca", "Fiumei út"] },
  { name: "IX. Ker.", center: [47.4800, 19.0700], streets: ["Üllői út", "Ferenc körút", "Mester utca"] },
  { name: "X. Ker.", center: [47.4850, 19.1000], streets: ["Kőbányai út", "Maglódi út", "Szent László tér"] },
  { name: "XI. Ker.", center: [47.4700, 19.0400], streets: ["Bartók Béla út", "Fehérvári út", "Villányi út"] },
  { name: "XII. Ker.", center: [47.4900, 19.0000], streets: ["Németvölgyi út", "Apor Vilmos tér", "Kiss János altábornagy utca"] },
  { name: "XIII. Ker.", center: [47.5300, 19.0700], streets: ["Lehel utca", "Róbert Károly körút", "Fiastyúk utca"] },
  { name: "XIV. Ker.", center: [47.5100, 19.1000], streets: ["Hungária körút", "Thököly út", "Stefánia út"] },
  { name: "XV. Ker.", center: [47.5500, 19.1000], streets: ["Páskomliget utca", "Erdőkerülő utca", "Régi Fóti út"] },
  { name: "XVI. Ker.", center: [47.5200, 19.1500], streets: ["Veres Péter út", "Szabadföld út", "Csömöri út"] },
  { name: "XVII. Ker.", center: [47.5000, 19.2000], streets: ["Pesti út", "Ferihegyi út", "Helikopter utca"] },
  { name: "XVIII. Ker.", center: [47.4500, 19.1800], streets: ["Üllői út", "Lőrinc út", "Lakatos út"] },
  { name: "XIX. Ker.", center: [47.4600, 19.1400], streets: ["Ady Endre út", "Petőfi utca", "Simonyi Zsigmond utca"] },
  { name: "XX. Ker.", center: [47.4400, 19.1000], streets: ["Helsinki út", "Szent Erzsébet tér", "Ady Endre utca"] },
  { name: "XXI. Ker.", center: [47.4200, 19.0800], streets: ["II. Rákóczi Ferenc út", "Kossuth Lajos utca", "Ady Endre utca"] },
  { name: "XXII. Ker.", center: [47.4300, 19.0400], streets: ["Nagytétényi út", "Rózsakerti utca", "Temető utca"] },
  { name: "XXIII. Ker.", center: [47.4100, 19.0700], streets: ["Haraszti út", "Grassalkovich út", "Tartsay Vilmos utca"] },
];

const speciesList = ["Oak", "Pine", "Maple", "Birch", "Chestnut"];
const healthList = ["Good", "Moderate", "Poor"];

const sampleTrees = Array.from({ length: 100 }, (_, i) => {
  const district = districtDataList[Math.floor(Math.random() * districtDataList.length)];
  const species = speciesList[Math.floor(Math.random() * speciesList.length)];
  const health = healthList[Math.floor(Math.random() * healthList.length)];
  const street = district.streets[Math.floor(Math.random() * district.streets.length)];
  const co2 = Math.floor(Math.random() * 50) + 10;
  const lat = district.center[0] + (Math.random() - 0.5) * 0.01;
  const lng = district.center[1] + (Math.random() - 0.5) * 0.01;

  return {
    id: i + 1,
    name: `${species} Tree #${i + 1}`,
    species,
    health,
    co2AbsorptionKg: co2,
    district: district.name,
    address: `${street} ${Math.floor(Math.random() * 100)}, ${district.name}`,
    coords: [lat, lng] as [number, number],
  };
});

const COLORS = ["#34d399", "#60a5fa", "#facc15", "#f87171"];

const TreeDashboard = () => {
  const [healthFilter, setHealthFilter] = useState("All");
  const [districtFilter, setDistrictFilter] = useState("All");
  const [streetQuery, setStreetQuery] = useState("");
  const [co2Goal, setCo2Goal] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredTrees = sampleTrees.filter((t) => {
    const healthOk = healthFilter === "All" || t.health === healthFilter;
    const districtOk = districtFilter === "All" || t.district === districtFilter;
    const streetOk = streetQuery === "" || t.address.toLowerCase().includes(streetQuery.toLowerCase());
    return healthOk && districtOk && streetOk;
  });

  const speciesData = Object.values(
    filteredTrees.reduce((acc, tree) => {
      acc[tree.species] = acc[tree.species] || { name: tree.species, value: 0 };
      acc[tree.species].value += 1;
      return acc;
    }, {} as Record<string, { name: string; value: number }>)
  );

  const districtOrder = [
  "I. Ker.", "II. Ker.", "III. Ker.", "IV. Ker.", "V. Ker.",
  "VI. Ker.", "VII. Ker.", "VIII. Ker.", "IX. Ker.", "X. Ker.",
  "XI. Ker.", "XII. Ker.", "XIII. Ker.", "XIV. Ker.", "XV. Ker.",
  "XVI. Ker.", "XVII. Ker.", "XVIII. Ker.", "XIX. Ker.", "XX. Ker.",
  "XXI. Ker.", "XXII. Ker.", "XXIII. Ker."
];

  const districtChartData = Object.values(
  filteredTrees.reduce((acc, tree) => {
    acc[tree.district] = acc[tree.district] || { district: tree.district, co2: 0 };
    acc[tree.district].co2 += tree.co2AbsorptionKg;
    return acc;
  }, {} as Record<string, { district: string; co2: number }>)
).sort(
  (a, b) => districtOrder.indexOf(a.district) - districtOrder.indexOf(b.district)
);


  const handleCo2Calculation = () => {
    const goal = parseFloat(co2Goal);
    if (isNaN(goal) || goal <= 0) return "";

    const avgAbsorptionPerTreeTonnes =
      filteredTrees.length > 0
        ? filteredTrees.reduce((sum, t) => sum + t.co2AbsorptionKg, 0) / filteredTrees.length / 1000
        : 0.04;

    const requiredTrees = Math.ceil(goal / avgAbsorptionPerTreeTonnes);
    return `🌱 To offset ${goal} tonnes CO₂/year, plant approx. ${requiredTrees} trees.`;
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50 font-sans">
      <div className="flex-1">
        <MapContainer center={[47.4979, 19.0402]} zoom={12} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {filteredTrees.map((tree) => (
            <Marker key={tree.id} position={tree.coords}>
              <Popup>
                <div className="text-sm">
                  <strong>{tree.name}</strong><br />
                  {tree.species} – CO₂: {tree.co2AbsorptionKg} kg<br />
                  📍 {tree.address}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

        <div className="w-[45%] flex flex-col bg-gradient-to-b from-green-50 via-green-200 to-green-400 shadow-xl overflow-y-auto">
        <div className="p-4 bg-green-50 border-b">
          <h1 className="text-2xl font-bold mb-3 text-green-900">Tree Dashboard</h1>

          <button
            onClick={() => {
              setHealthFilter("All");
              setDistrictFilter("All");
              setStreetQuery("");
            }}
            className="mb-3 w-full px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:from-red-600 hover:to-pink-600 transform hover:scale-105 transition-all"
          >
            Reset Filters
          </button>

          <label className="block font-semibold mb-1">Filter by Health</label>
          <select value={healthFilter} onChange={(e) => setHealthFilter(e.target.value)} className="border p-2 rounded w-full mb-3">
            <option>All</option>
            <option>Good</option>
            <option>Moderate</option>
            <option>Poor</option>
          </select>

          <label className="block font-semibold mb-1">Filter by District</label>
          <select value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)} className="border p-2 rounded w-full mb-3">
            <option value="All">All</option>
            {districtDataList.map((d) => (
              <option key={d.name} value={d.name}>{d.name}</option>
            ))}
          </select>

          <label className="block font-semibold mb-1">Search by Street</label>
          <input
            value={streetQuery}
            onChange={(e) => setStreetQuery(e.target.value)}
            placeholder="Type street name..."
            className="border p-2 rounded w-full mb-3"
          />

          <div className="p-3 bg-white rounded shadow mb-3">
            <h2 className="font-semibold mb-2">🌍 CO₂ Goal Calculator</h2>
            <input
              type="number"
              value={co2Goal}
              onChange={(e) => setCo2Goal(e.target.value)}
              placeholder="Enter goal in tonnes"
              className="border p-2 rounded w-full mb-2"
            />
            <div className="text-sm text-green-800">{handleCo2Calculation()}</div>
          </div>
        </div>

        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">Species Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={speciesData} dataKey="value" outerRadius={80} label>
                {speciesData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2">CO₂ Absorption by District</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={districtChartData}>
              <XAxis dataKey="district" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="co2" fill="#16a34a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 space-y-3">
          {filteredTrees.slice(0, visibleCount).map((tree) => (
            <div key={tree.id} className="border rounded-xl p-4 shadow-md bg-white">
              <div className="flex items-center gap-2 mb-1">
                <TreePine size={18} className="text-green-600" />
                <span className="text-lg font-semibold">{tree.name}</span>
              </div>
              <div className="text-sm text-gray-700 flex items-center gap-1">
                <Leaf size={14} className="text-green-500" />
                {tree.species} – {tree.health} – CO₂: {tree.co2AbsorptionKg}kg
              </div>
              <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                <MapPin size={14} className="text-red-500" /> {tree.address}
              </div>
            </div>
          ))}

          {visibleCount < filteredTrees.length && (
            <button onClick={() => setVisibleCount(visibleCount + 5)} className="w-full bg-green-500 text-white px-4 py-2 rounded">
              Load More Trees
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TreeDashboard;
