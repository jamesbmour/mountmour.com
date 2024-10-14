<!-- ChannelList.svelte -->
<script lang="ts">
const channels = [
  { number: 2, name: "KWNG (CW)" },
  { number: 3, name: "KREG (CBS) Grand Junction" },
  { number: 4, name: "KCNC (CBS)" },
  { number: 5, name: "KTVD (My Network TV)" },
  { number: 6, name: "KRMA (PBS)" },
  { number: 7, name: "KMGH (ABC)" },
  { number: 8, name: "Pitkin County Channel" },
  { number: 9, name: "KUSA (NBC)" },
  { number: 10, name: "CPT" },
  { number: 11, name: "The Government Channel" },
  { number: 12, name: "Grass Roots" },
  { number: 13, name: "KDVR (FOX)" },
  { number: 14, name: "KZCO (Azteca America)" },
  { number: 15, name: "KCEC (Univision)" },
  { number: 16, name: "HSN" },
  { number: 17, name: "Basalt Local Access" },
  { number: 18, name: "KDEN (Telemundo)" },
  { number: 19, name: "KCXP" },
  { number: 20, name: "C-SPAN" },
  { number: 21, name: "QVC" },
  { number: 22, name: "KPXC (ION)" },
  { number: 23, name: "Discovery Channel" },
  { number: 24, name: "Golf Channel" },
  { number: 25, name: "ESPN" },
  { number: 26, name: "ESPN2" },
  { number: 27, name: "Root Sports Rocky Mountain" },
  { number: 28, name: "ALT" },
  { number: 29, name: "NBC Sports Network" },
  { number: 30, name: "Disney Channel" },
  { number: 31, name: "ABC Family" },
  { number: 32, name: "Cartoon Network" },
  { number: 33, name: "Nickelodeon" },
  { number: 34, name: "TV Land" },
  { number: 35, name: "Hallmark Channel" },
  { number: 36, name: "Spike" },
  { number: 37, name: "TLC" },
  { number: 38, name: "Animal Planet" },
  { number: 39, name: "History" },
  { number: 40, name: "A&E" },
  { number: 41, name: "HGTV" },
  { number: 42, name: "The Weather Channel" },
  { number: 43, name: "CNN" },
  { number: 44, name: "HLN" },
  { number: 45, name: "Fox News Channel" },
  { number: 46, name: "CNBC" },
  { number: 47, name: "MSNBC" },
  { number: 48, name: "Bloom" },
  { number: 49, name: "Lifetime" },
  { number: 50, name: "FX" },
  { number: 51, name: "Comedy Central" },
  { number: 52, name: "Bravo" },
  { number: 53, name: "E!" },
  { number: 54, name: "Oxygen" },
  { number: 55, name: "Syfy" },
  { number: 56, name: "USA" },
  { number: 57, name: "AMC" },
  { number: 60, name: "MTV" },
  { number: 61, name: "VH1" },
  { number: 62, name: "TNT" },
  { number: 63, name: "Food Network" },
  { number: 65, name: "Travel Channel" },
  { number: 66, name: "BET" },
  { number: 71, name: "truTV" },
  { number: 79, name: "Jewelry TV" },
  { number: 80, name: "HSN2" },
  { number: 82, name: "Aspen 82" },
  { number: 86, name: "GEMS" },
  { number: 87, name: "WOW" },
  { number: 94, name: "Leased Access" },
  { number: 95, name: "WGN America" },
  { number: 97, name: "DEN61" },
  { number: 98, name: "Local" },
  { number: 105, name: "CET" },
  { number: 119, name: "Sprout" },
  { number: 128, name: "Bloomberg TV" },
  { number: 130, name: "FBN" },
  { number: 149, name: "MoviePlex" },
  { number: 162, name: "BBC America" },
  { number: 165, name: "Colorado Channel" },
  { number: 184, name: "POP" },
  { number: 185, name: "Hallmark Channel" },
  { number: 188, name: "Jewelry TV" },
  { number: 220, name: "OWN" },
  { number: 221, name: "INSP" },
  { number: 230, name: "KPJR (TBN)" },
  { number: 236, name: "KPJR (The Church Channel)" },
  { number: 237, name: "KPJR (Enlacel)" },
  { number: 238, name: "KPJR (JCTV)" },
  { number: 239, name: "KPJR Smile of a Child" },
  { number: 243, name: "KRMT (Daystar)" },
  { number: 245, name: "KRMA (PBS Create)" },
  { number: 249, name: "KUSA (9 News Weather Plus)" },
  { number: 250, name: "KTDV (Me TV)" },
  { number: 251, name: "KBDI (CPT+)" },
  { number: 252, name: "KBDI (Mhz Worldwide)" },
  { number: 253, name: "KDVR (Antenna TV)" },
  { number: 254, name: "TJN" },
  { number: 256, name: "KWGN (This TV)" },
  { number: 259, name: "KCEC (LATV)" },
  { number: 261, name: "KDEN (Exitos)" },
  { number: 271, name: "Investigation Discovery" },
  { number: 273, name: "National Geographic" },
  { number: 275, name: "FYI" },
  { number: 276, name: "H2" },
  { number: 299, name: "XFINITY Latino" },
  { number: 333, name: "KPJR" },
  { number: 408, name: "Fox Sports 1" },
  { number: 430, name: "PAC 12 Network (regional)" },
  { number: 482, name: "UP" },
  { number: 502, name: "WE" },
  { number: 504, name: "LMN" },
  { number: 507, name: "Hallmark Movie Channel" },
  // HD Channels
  { number: 647, name: "KCEC HD (Univision)" },
  { number: 648, name: "ION" },
  { number: 652, name: "KMGH HD (ABC)" },
  { number: 653, name: "KUSA HD (NBC)" },
  { number: 654, name: "KCNC HD (CBS)" },
  { number: 655, name: "KDVR HD (FOX)" },
  { number: 656, name: "KWGN HD (CW)" },
  { number: 657, name: "KTDV HD (My Network TV)" },
  { number: 658, name: "KRMA HD" },
  { number: 659, name: "KREG HD (CBS)" },
  { number: 660, name: "CPT12" },
  { number: 663, name: "Velocity HD" },
  { number: 664, name: "AXS TV HD" },
  { number: 665, name: "Root Sports Rocky Mountain HD" },
  { number: 667, name: "TNT HD" },
  { number: 668, name: "ESPN HD" },
  { number: 670, name: "ESPN2 HD" },
  { number: 671, name: "Palladia HD" },
  { number: 672, name: "Golf HD" },
  { number: 673, name: "Universal HD" },
  { number: 674, name: "National Geographic HD" },
  { number: 675, name: "A&E HD" },
  { number: 677, name: "TLC HD" },
  { number: 678, name: "TBS HD" },
  { number: 679, name: "Disney Channel HD" },
  { number: 680, name: "ABC Family HD" },
  { number: 681, name: "Food Network HD" },
  { number: 682, name: "HGTV HD" },
  { number: 688, name: "SyFy HD" },
  { number: 689, name: "NBC Sports Network HD" },
  { number: 691, name: "FX HD" },
  { number: 692, name: "FXX" },
  { number: 721, name: "QVC HD" },
  { number: 723, name: "Discovery Channel HD" },
  { number: 728, name: "Altitude Sports HD" },
  { number: 732, name: "Cartoon Network HD" },
  { number: 733, name: "Nickelodeon HD" },
  { number: 735, name: "Hallmark Channel HD" },
  { number: 736, name: "Spike HD" },
  { number: 738, name: "Animal Planet HD" },
  { number: 741, name: "Bloomberg TV HD" },
  { number: 742, name: "The Weather Channel" },
  { number: 743, name: "CNN HD" },
  { number: 744, name: "HLN HD" },
  { number: 745, name: "Fox News Channel HD" },
  { number: 746, name: "CNBC HD" },
  { number: 747, name: "MSNBC HD" },
  { number: 748, name: "USA Network HD" },
  { number: 749, name: "Lifetime HD" },
  { number: 750, name: "Oxygen HD" },
  { number: 751, name: "Comedy Central HD" },
  { number: 752, name: "Bravo HD" },
  { number: 753, name: "E! HD" },
  { number: 757, name: "AMC HD" },
  { number: 760, name: "MTV HD" },
  { number: 761, name: "VH1 HD" },
  { number: 765, name: "Travel Channel HD" },
  { number: 771, name: "truTV HD" },
  { number: 773, name: "BBC America HD" },
  { number: 777, name: "Fox Sports 1 HD" },
  { number: 782, name: "POP HD" },
  { number: 783, name: "WE" },
  { number: 784, name: "FYI HD" },
  { number: 787, name: "Esquire HD" },
  { number: 790, name: "H2 HD" },
  { number: 791, name: "Investigation Discovery HD" },
  { number: 793, name: "FBN" },
  { number: 795, name: "BET HD" },
  { number: 796, name: "HSN HD" },
  { number: 799, name: "WGN America HD" },
  { number: 836, name: "UP HD" },
  { number: 838, name: "Sprout HD" },
  { number: 840, name: "PAC 12 Network HD (Regional)" },
  { number: 857, name: "Hallmark Movie Channel HD" },
  { number: 858, name: "LMN HD" },
  { number: 900, name: "CET" },
  { number: 901, name: "Music Choice" },
];


  let searchTerm = '';
  let sortOption: 'number' | 'name' = 'number';

  $: filteredChannels = filterChannels(searchTerm, sortOption);

  function filterChannels(searchTerm: string, sortOption: 'name' | 'number') {
    let filtered = channels.filter((channel) =>
      channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      channel.number.toString().includes(searchTerm)
    );
    
    if (sortOption === 'name') {
      return filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      return filtered.sort((a, b) => a.number - b.number);
    }
  }
</script>


<div class="p-4">
  <!-- <h2 class="mb-4 text-2xl font-bold">Channel Guide</h2> -->
  <div class="flex items-center mb-4">
    <input
      type="text"
      placeholder="Search by channel name or number"
      bind:value={searchTerm}
      class="w-full px-3 py-2 mr-2 border border-gray-300 rounded"
    />
    
    <select bind:value={sortOption} class="px-3 py-2 border border-gray-300 rounded">
      <option value="number">Sort by Channel Number</option>
      <option value="name">Sort by Channel Name</option>
    </select>
  </div>

  <table class="w-full">
    <thead>
      <tr class="bg-gray-100">
        <th class="px-4 py-2">Channel Number</th>
        <th class="px-4 py-2">Channel Name</th>
      </tr>
    </thead>
    <tbody>
      {#each filteredChannels as channel (channel.number)}
        <tr>
          <td class="px-4 py-2">{channel.number}</td>
          <td class="px-4 py-2">{channel.name}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>