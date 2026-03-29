// ── GLOBAL SEARCH LOCATIONS MASTER AUDIT ──
// This file coordinates 100% of the sovereign states for the Frontier Holographic Map.
// Each country is a modular JS module containing capital/state coordinates.

window.LOCATION_COORDS = {
    // Top-Level Hierarchical Anchors (Continents)
    "north america": { lat: 40.0, lon: -100.0 },
    "south america": { lat: -14.2, lon: -51.9 },
    "europe": { lat: 50.0, lon: 10.0 },
    "asia": { lat: 34.0, lon: 100.0 },
    "africa": { lat: 8.7, lon: 20.9 },
    "australia continent": { lat: -25.2, lon: 133.7 },
    "antarctica": { lat: -82.8, lon: 135.0 }
};

// ── FULL GLOBAL SATELLITE LOADER ──
(function() {
    const countries = [
        "afghanistan.js", "albania.js", "algeria.js", "andorra.js", "angola.js", "antigua_and_barbuda.js", 
        "argentina.js", "armenia.js", "australia.js", "austria.js", "azerbaijan.js", "bahamas.js", 
        "bahrain.js", "bangladesh.js", "barbados.js", "belarus.js", "belgium.js", "belize.js", 
        "benin.js", "bhutan.js", "bolivia.js", "bosnia_and_herzegovina.js", "botswana.js", "brazil.js", 
        "brunei.js", "bulgaria.js", "burkina_faso.js", "burundi.js", "cambodia.js", "cameroon.js", 
        "canada.js", "cape_verde.js", "central_african_republic.js", "chad.js", "chile.js", "china.js", 
        "colombia.js", "comoros.js", "costa_rica.js", "cote_divoire.js", "croatia.js", "cuba.js", 
        "cyprus.js", "czech_republic.js", "denmark.js", "djibouti.js", "dominica.js", "dominican_republic.js", 
        "drc.js", "east_timor.js", "ecuador.js", "egypt.js", "el_salvador.js", "equatorial_guinea.js", 
        "eritrea.js", "estonia.js", "eswatini.js", "ethiopia.js", "fiji.js", "finland.js", "france.js", 
        "gabon.js", "gambia.js", "georgia.js", "germany.js", "ghana.js", "greece.js", "grenada.js", 
        "guatemala.js", "guinea.js", "guinea_bissau.js", "guyana.js", "haiti.js", "honduras.js", 
        "hungary.js", "iceland.js", "india.js", "indonesia.js", "iran.js", "iraq.js", "ireland.js", 
        "israel.js", "italy.js", "jamaica.js", "japan.js", "jordan.js", "kazakhstan.js", "kenya.js", 
        "kiribati.js", "kosovo.js", "kuwait.js", "kyrgyzstan.js", "laos.js", "latvia.js", "lebanon.js", 
        "lesotho.js", "liberia.js", "libya.js", "liechtenstein.js", "lithuania.js", "luxembourg.js", 
        "madagascar.js", "malawi.js", "malaysia.js", "maldives.js", "mali.js", "malta.js", 
        "marshall_islands.js", "mauritania.js", "mauritius.js", "mexico.js", "micronesia.js", 
        "moldova.js", "monaco.js", "mongolia.js", "montenegro.js", "morocco.js", "mozambique.js", 
        "myanmar.js", "namibia.js", "nauru.js", "nepal.js", "netherlands.js", "new_zealand.js", 
        "nicaragua.js", "niger.js", "nigeria.js", "north_korea.js", "north_macedonia.js", "norway.js", 
        "oman.js", "pakistan.js", "palau.js", "palestine.js", "panama.js", "papua_new_guinea.js", 
        "paraguay.js", "peru.js", "philippines.js", "poland.js", "portugal.js", "qatar.js", 
        "republic_of_congo.js", "romania.js", "russia.js", "rwanda.js", "samoa.js", "san_marino.js", 
        "sao_tome_and_principe.js", "saudi_arabia.js", "senegal.js", "serbia.js", "seychelles.js", 
        "sierra_leone.js", "singapore.js", "slovakia.js", "slovenia.js", "solomon_islands.js", 
        "somalia.js", "south_africa.js", "south_korea.js", "south_sudan.js", "spain.js", "sri_lanka.js", 
        "st_kitts_and_nevis.js", "st_lucia.js", "st_vincent.js", "sudan.js", "suriname.js", "sweden.js", 
        "switzerland.js", "syria.js", "taiwan.js", "tajikistan.js", "tanzania.js", "thailand.js", 
        "togo.js", "tonga.js", "trinidad_and_tobago.js", "tunisia.js", "turkey.js", "turkmenistan.js", 
        "tuvalu.js", "uae.js", "uganda.js", "uk.js", "ukraine.js", "uruguay.js", "usa.js", "uzbekistan.js", 
        "vanuatu.js", "vatican_city.js", "venezuela.js", "vietnam.js", "yemen.js", "zambia.js", "zimbabwe.js"
    ];
    
    countries.forEach(file => {
        const script = document.createElement('script');
        script.src = `country/${file}`;
        script.async = false;
        document.head.appendChild(script);
    });
    
    console.log(`Global Satellite Audit: ${countries.length} locations linked. TOTAL GLOBE REACHED.`);
})();
