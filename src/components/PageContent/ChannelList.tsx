---
// ChannelList.astro
import { useState } from 'preact/hooks';

const channels = [
  { number: 2, name: "NBC" },
  { number: 4, name: "CBS" },
  { number: 5, name: "FOX" },
  { number: 7, name: "ABC" },
  { number: 9, name: "PBS" },
  { number: 13, name: "ESPN" },
  { number: 16, name: "CNN" },
  // Add more channels from your data
];

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

const ChannelList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<'number' | 'name'>('number');

  const filteredChannels = filterChannels(searchTerm, sortOption);

  return (
    <div>
      <h2>Channel Guide</h2>
      <div>
        <input
          type="text"
          placeholder="Search by channel name or number"
          value={searchTerm}
          onInput={(e) => setSearchTerm(e.currentTarget.value)}
        />
        
        <select 
          value={sortOption} 
          onChange={(e) => setSortOption(e.currentTarget.value as 'number' | 'name')}
        >
          <option value="number">Sort by Channel Number</option>
          <option value="name">Sort by Channel Name</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Channel Number</th>
            <th>Channel Name</th>
          </tr>
        </thead>
        <tbody>
          {filteredChannels.map((channel) => (
            <tr key={channel.number}>
              <td>{channel.number}</td>
              <td>{channel.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
---

<ChannelList client:load />
